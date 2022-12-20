// Point object?
function Point (x,y) {
    this.x = x
    this.y = y
    this.color = "white"
}

function polar_angle (p, q) {
    return Math.atan2(q.y - p.y, q.x - p.x)
}

function left_turn (a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0
}

function get_pivot_point (points) {
    let p_0 = points[0]

    /* Finding lowest point, breaking ties by lower x-coord */
    for (let p of points) {
        p.color = "white"

        if (p.y > p_0.y || (p.y == p_0.y && p.x < p_0.x)) {
            p_0 = p
        }
    }

    return p_0
}

function sort_by_angle (points, p_0) {
    points.sort((a,b) => { 
        return polar_angle(p_0, a) - polar_angle(p_0, b)
    })

    return points
}

function graham_scan (points) {
    let stack = []

    /* Finding lowest point, breaking ties by lower x-coord */
    let p_0 = get_pivot_point(points)

    console.log("P0:",p_0.x, p_0.y)
    p_0.color = "#AEF359"

    /* sort points by angle from origin p_0 */
    points = sort_by_angle(points, p_0)


    /* build stack */
    console.log(stack)
    for (let p of points) {
        while (stack.length > 1 && !left_turn(stack[stack.length-2], stack[stack.length-1], p))  {
            stack.pop()
        }

        stack.push(p)
    }

    return stack
}