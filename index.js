module.exports = solarpunkIcon

function solarpunkIcon () {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="-1 -1 2 2"
    >
      ${plants({ size: 0.25, offsetRadius: 0.2 })}
      ${gear({ offsetRadius: 0.15, toothLength: 0.3, toothWidth: 0.2 })}
      ${moons({ moonRadius: 0.1, offsetRadius: 0.7 })}
    </svg>
  `
}

function gear ({ offsetRadius, toothLength, toothWidth }) {
  return `
    <style type="text/css">
      .gear {
        stroke: black;
        stroke-width: ${toothLength / 20};
      }
      .gear-tooth {
        fill: purple;
      }
    </style>
    <g class="gear">
      ${range({ start: 0, stop: 1, step: 1/8 })
          .map(index => gearTooth({
            angle: (1/16 + index) * 2 * Math.PI,
            offset: offsetRadius,
            length: toothLength,
            width: toothWidth
          }))
          .join('\n')
       }
    </g>
  `
}

function gearTooth ({ angle, offset, length, width }) {
  return `
    <g
      class="gear-tooth"
      transform="rotate(${angle * 180 / Math.PI})"
    >
      <rect x="${-width / 2}" y="${offset}" height="${length}" width="${width}" />
    </g>
  `
}

function plants ({ size, offsetRadius }) {
  return `
    <style type="text/css">
      .plant {
        stroke: black;
        stroke-width: ${size / 20};
      }
      .plant-stem {
        fill: none;
      }
    </style>
    ${range({ start: 0, stop: 1, step: 1/8 })
        .map(index => plant({
          size,
          angle: index * 2 * Math.PI,
          offsetRadius
        }))
        .join('\n')
     }
  `
}

function plant ({ size, angle, offsetRadius }) {
  return `
    <g
      class="plant"
      transform="
        rotate(${angle * 180 / Math.PI})
        translate(0, ${offsetRadius})
      "
    >
      <path class="plant-stem"
        d="
          M 0,0
          L 0,${size}
        "
      />
      <path class="plant-stem"
        d="
          M 0,${size * 0.9}
          C 0,${size * 0.8} 0,${size * 1.2} ${size * 0.3},${size * 1.4}
        "
      />
      <path class="plant-stem"
        d="
          M 0,${size * 0.9}
          C 0,${size * 0.8} 0,${size * 1.2} ${size * -0.3},${size * 1.4}
        "
      />
    </g>
  `
}

function moons ({ moonRadius, offsetRadius }) {
  return `
    <style type="text/css">
      .moon {
        stroke: black;
        stroke-width: ${moonRadius / 20};
      }
      .moon-front {
        fill: white;
      }
      .moon-back {
        fill: purple;
      }
    </style>
    ${range({ start: 0, stop: 1, step: 1/8 })
      .map(index => moon({
        radius: moonRadius,
        center: rotate({ angle: index * 2 * Math.PI, point: { x: 0, y: offsetRadius } }),
        phase: index
      }))
      .join('\n')
    }
  `
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

  var r = radius / 5

  return `
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
}

function rotate ({ center = { x: 0, y: 0}, angle, point }) {
  const a = Math.atan2(point.y - center.y, point.x - center.x)
  const r = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2))
  return {
    x: r * Math.cos(a + angle),
    y: r * Math.sin(a + angle)
  }
}


// https://stackoverflow.com/a/44957114
function range ({ start = 0, stop, step = 1 }) {
  return Array(Math.ceil((stop - start) / step))
    .fill(start).map((x, y) => x + y * step)
}
