/* Point-space canvas */
let space_canvas = document.getElementById("pointspace")

let space_ctx = space_canvas.getContext("2d")
space_ctx.canvas.width  = space_canvas.clientWidth
space_ctx.canvas.height = space_canvas.clientHeight
let space_w = space_canvas.width
let space_h = space_canvas.height
let points = []
let convex_hull = []
/* Data visualization canvas */
let dvsiz_canvas = document.getElementById("datastructureviz")
let dsviz_ctx = dvsiz_canvas.getContext("2d")
let dvsiz_w = dvsiz_canvas.width
let dsviz_h = dvsiz_canvas.height

let total_time_sort = 2000
let total_time_stack = 5000

document.getElementById('sort_time').onchange = (event) => {
    total_time_sort = parseInt(event.target.value) * 1000
}

document.getElementById('stack_time').onchange = (event) => {
    total_time_stack = parseInt(event.target.value) * 1000
}

function generate_points () {
    console.log ("spawn points!")
    n = 5

    border_padding = 50

    for (let i = 0; i < n; i++) {
        let p_x = Math.floor(Math.random() * (space_w - border_padding*2) + border_padding)
        let p_y = Math.floor(Math.random() * (space_h - border_padding*2) + border_padding)

        let new_p = new Point(p_x, p_y)
        points.push(new_p)
    }
    current_step = 0
    convex_hull = []
    console.log(points)
    draw_pointspace()
}

function clear_points () {
    console.log("clear points!")
    points = []
    convex_hull = []
    current_step = 0
    draw_pointspace()
}

function do_graham_scan () {
    convex_hull = graham_scan(points)
    draw_pointspace()
}

let p_0
let steps = [
    function() {
        p_0 = get_pivot_point(points)
        p_0.color = "#AEF359"
        clear_screen() 
        draw_points()
    }
    , 
    function() {
        sort_by_angle(points, p_0)
        draw_lines_from_pivot(p_0)
    }
    ,
    function() {
        draw_stack_traversal(points)
    }]

let current_step = 0

function graham_scan_step () {
    console.log(current_step)
    steps[current_step](points)

    current_step = (current_step + 1) % steps.length

}

function clear_screen () {
    space_ctx.fillStyle = "#222222"
    space_ctx.strokeStyle = "#222222"
    space_ctx.fillRect(0,0, space_w, space_h)
}

function draw_points () {
    /* draw points */
    for (let p of points) {
        space_ctx.fillStyle = p.color
        space_ctx.strokeStyle = p.color
        space_ctx.beginPath()
        
        space_ctx.moveTo(p.x + 3, p.y)        
        space_ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI, false)

        space_ctx.stroke()
        space_ctx.fill()
    }
}

function draw_lines_from_pivot(p_0) {
    console.log("Let's do it!")
    space_ctx.fillStyle = "green"
    space_ctx.strokeStyle = "green"
    
    let pstack = JSON.parse(JSON.stringify(points))

    function draw_line () {
        if (pstack.length === 0) {
            return
        }

        let p = pstack.pop()

        space_ctx.beginPath()
        space_ctx.moveTo(p_0.x, p_0.y)
        space_ctx.lineTo(p.x, p.y)
        space_ctx.closePath()

        space_ctx.stroke()

        setTimeout(draw_line, total_time_sort / points.length)
    }

    draw_line()
}

const sleep = m => new Promise(r => setTimeout(r, m))

function draw_stack_traversal(points) {
    let p_index = 0

    let stack = []

    clear_screen()
    draw_points()

    space_ctx.moveTo(p_0.x, p_0.y)

    async function explore_point () {
        if (p_index == points.length) {
            return
        }

        clear_screen()
        draw_points()

        space_ctx.fillStyle = "pink"
        space_ctx.strokeStyle = "pink"

        space_ctx.beginPath()
        space_ctx.moveTo(p_0.x, p_0.y)
        for (let i = 0; i < stack.length; i++) {
            space_ctx.lineTo(stack[i].x, stack[i].y)
        }

        space_ctx.lineTo(points[p_index].x, points[p_index].y)
        space_ctx.stroke()

        while (stack.length > 1 && !left_turn(stack[stack.length-2], stack[stack.length-1], points[p_index]))  {

            await new Promise(resolve => setTimeout(resolve, total_time_stack / points.length));

            stack.pop()

            clear_screen()
            draw_points()

            space_ctx.fillStyle = "pink"
            space_ctx.strokeStyle = "pink"

            space_ctx.beginPath()
            
            space_ctx.moveTo(p_0.x, p_0.y)
            for (let i = 0; i < stack.length; i++) {
                space_ctx.lineTo(stack[i].x, stack[i].y)
            }

            space_ctx.lineTo(points[p_index].x, points[p_index].y)
            space_ctx.stroke();
        }

        stack.push(points[p_index])
        p_index += 1

        setTimeout(explore_point, total_time_stack / points.length)
    }

    explore_point()
}

function draw_pointspace () {
    clear_screen ()

    /* draw convex hull */
    space_ctx.fillStyle = "red"
    space_ctx.strokeStyle = "red"
    for (let i = 0; i < convex_hull.length; i ++) {
        space_ctx.moveTo(convex_hull[i].x, convex_hull[i].y)

        if (i === convex_hull.length - 1) {
            space_ctx.lineTo(convex_hull[0].x, convex_hull[0].y)
        } else {
            space_ctx.lineTo(convex_hull[i+1].x, convex_hull[i+1].y) 
        }

        space_ctx.stroke()
        space_ctx.fill()
    }

    draw_points()

}