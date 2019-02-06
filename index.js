module.exports = solarpunkIcon

function solarpunkIcon () {
  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="-1 -1 2 2"
>
  ${moon.style}
  ${range({ start: 0, stop: 1, step: 1/8 })
      .map(index => moon({
        radius: 0.1,
        center: rotate({ angle: index * 2 * Math.PI, point: { x: 0, y: 0.5 } }),
        phase: index
      }))
      .join('\n')
   }
</svg>
`
}

function gear ({ center, numThreads, threadLength, centerLength }) {
  return `
<g>
    
</g>
`
}

function rotate ({ center = { x: 0, y: 0}, angle, point }) {
  const a = Math.atan2(point.y - center.y, point.x - center.x)
  const r = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2))
  return {
    x: r * Math.cos(a + angle),
    y: r * Math.sin(a + angle)
  }
}

// inspired by https://github.com/tingletech/moon-phase
function moon ({ radius, center, phase }) {
  var sweep = []
  var mag

  // the "sweep-flag" and the direction of movement change every quarter moon
  // zero and one are both new moon; 0.50 is full moon
  if (phase <= 0.25) {
    sweep = [ 1, 0 ]
    mag = 1 - phase * 4
  } else if (phase <= 0.50) { 
    sweep = [ 0, 0 ]
    mag = (phase - 0.25) * 4
  } else if (phase <= 0.75) {
    sweep = [ 1, 1 ]
    mag = 1 - (phase - 0.50) * 4
  } else if (phase <= 1) {
    sweep = [ 0, 1 ]
    mag = (phase - 0.75) * 4
  } else { 
    throw new Error(`unexpected moon phase: ${phase}`)
  }

  // http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
  // http://www.i-programmer.info/programming/graphics-and-imaging/3254-svg-javascript-and-the-dom.html

    /*
  var d = "m100,0 ";
  d = d + "a" + mag + ",20 0 1," + sweep[0] + " 0,150 ";
  d = d + "a20,20 0 1," + sweep[1] + " 0,-150";
  */

  var r = radius / 5

  return `
    <style type="text/css">
      .moon {
        stroke: black;
        stroke-width: ${radius / 20};
      }
      .moon-front {
        fill: white;
      }
      .moon-back {
        fill: purple;
      }
    </style>
    <g class="moon">
      <path
        class="moon-back"
        d="M ${center.x},${center.y - radius / 2}
           a ${r},${r} 0 1,1 0,${radius}
           a ${r},${r} 0 1,1 0,-${radius}"
      />
      <path
        class="moon-front"
        d="M ${center.x},${center.y - radius / 2}
           a ${mag * r},${r} 0 1,${sweep[0]} 0,${radius}
           a ${r},${r} 0 1,${sweep[1]} 0,-${radius}"
      />
    </g>
  `

  // d="m100,0 a20,20 0 1,1 0,150 a20,20 0 1,1 0,-150"
}

// https://stackoverflow.com/a/44957114
function range ({ start = 0, stop, step = 1 }) {
  return Array(Math.ceil((stop - start) / step))
    .fill(start).map((x, y) => x + y * step)
}
