module.exports = solarpunkIcon

function solarpunkIcon () {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="-1 -1 2 2"
    >
      ${plants({ size: 0.25, offsetRadius: 0.2 })}
      ${turbine({ offsetRadius: 0.05, bladeLength: 0.3, bladeWidth: 0.08 })}
      ${moons({ moonRadius: 0.2, offsetRadius: 0.7 })}
    </svg>
  `
}

function turbine ({ offsetRadius, bladeLength, bladeWidth }) {
  return `
    <style type="text/css">
      .turbine {
        stroke: black;
        stroke-width: ${bladeLength / 20};
      }
      .turbine-blade {
        fill: purple;
      }
    </style>
    <g class="turbine">
      ${range({ start: 0, stop: 1, step: 1 / 8 })
        .map(index => turbineBlade({
          angle: (1 / 16 + index) * 2 * Math.PI,
          offset: offsetRadius,
          length: bladeLength,
          width: bladeWidth
        }))
        .join('\n')
      }
    </g>
  `
}

function turbineBlade ({ angle, offset, length, width }) {
  return `
    <g
      class="turbine-blade"
      transform="rotate(${angle * 180 / Math.PI})"
    >
      <path
        d="
          M ${-width / 2},${offset}
          a ${width},${length} 0 1,0 ${width},0
          z
        "
      />
    </g>
  `
  // d="M 66.901772,258.06844 A 38.175598,233.58929 0 0 1 105.06843,24.479163 38.175598,233.58929 0 0 1 143.25296,257.95908 l -38.17559,0.10937 z" />
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
      .plant-leaf {
        fill: green;
      }
    </style>
    ${range({ start: 0, stop: 1, step: 1 / 8 })
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
      ${plantStem({ size, direction: 1 })}
      ${plantStem({ size, direction: -1 })}
      ${plantLeaf({ size, direction: 1 })}
      ${plantLeaf({ size, direction: -1 })}
    </g>
  `
}

function plantStem ({ size, direction }) {
  return `
    <path class="plant-stem"
      d="
        M 0,${size * 0.9}
        C 0,${size * 0.8} 0,${size * 1.2} ${size * direction * 0.3},${size * 1.4}
      "
    />
  `
}

function plantLeaf ({ size, direction }) {
  return `
    <path class="plant-leaf"
      d="
        M ${size * direction * 0.3},${size * 1.4}
        a ${size},${size} -45 0,0 ${size * direction * 0.8},${size * 0.6}
        A ${size},${size} -45 0,0 ${size * direction * 0.3},${size * 1.4}
      "
    />
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
    ${range({ start: 0, stop: 1, step: 1 / 8 })
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

function rotate ({ center = { x: 0, y: 0 }, angle, point }) {
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
