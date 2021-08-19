import {circle, computeBoundaries, css, isOver, line, toCoords} from "./utils";

const HEIGHT = 40
const DPI_HEIGHT = HEIGHT * 2

export function slider(root, data, DPI_WIDTH) {
    const WIDTH = DPI_WIDTH / 2
    const MIN_WIDTH = WIDTH * 0.05

    const canvas = root.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT
    css(canvas, {
        width: WIDTH + 'px',
        height: HEIGHT + 'px'
    })

    const $left = root.querySelector('[data-el="left"]')
    const $window = root.querySelector('[data-el="window"]')
    const $right = root.querySelector('[data-el="right"]')

    function mouseDown(event) {
        const type = event.target.dataset.type;
        const dimensions = {
            left: parseInt($window.style.left),
            right: parseInt($window.style.right),
            width: parseInt($window.style.width)
        }

        if (type === 'window') {
            const startX = event.pageX
            document.onmousemove = e => {
                const delta = startX - e.pageX
                if (delta == 0) return

                const left = dimensions.left - delta
                const right = WIDTH - left - defaultWidth

                setPosition(left, right)
            }
        }
    }

    function mouseup() {
        document.onmousemove = null
    }

    root.addEventListener('mousedown', mouseDown)
    document.addEventListener('mouseup', mouseup)

    const defaultWidth = WIDTH * 0.3

    function setPosition(left, right) {
        const w = WIDTH - right - left

        if (w < MIN_WIDTH) {
            css($window, {width: MIN_WIDTH + 'px'})
            return
        }

        if (left < 0) {
            css($window, {left: '0px'})
            css($left, {width: '0px'})
            return
        }

        if (right < 0) {
            css($window, {left: '0px'})
            css(right, {width: '0px'})
            return
        }

        css($window, {
            width: w + 'px',
            left: left + 'px',
            right: right + 'px'
        })


        css($right, {width: right + 'px'})
        css($left, {width: left + 'px'})
    }

    setPosition(0,WIDTH - defaultWidth)

    const [yMin, yMax] = computeBoundaries(data)
    const yRatio = DPI_HEIGHT / (yMax - yMin)
    const xRatio = DPI_WIDTH / (data.columns[0].length - 2)


    const yData = data.columns.filter((col) => data.types[col[0]] === 'line')


    yData.map(toCoords(xRatio, yRatio, DPI_HEIGHT, -5)).forEach((coords, idx) => {
        const color = data.colors[yData[idx][0]]
        line(ctx, coords, {color})
    })
}