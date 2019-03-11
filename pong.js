"use strict";
function pong() {
    var circle = movingBall();
    dragRectPlayer(circle);
    badPlayer(circle);
    const svg = document.getElementById("canvas"), middleLine = new Elem(svg, 'line').attr('x1', 300).attr('x2', 600).attr('stroke', 'white');
    Observable.interval(10).subscribe(_ => middleLine.attr('x1', 300).attr('x2', 300).attr('stroke', 'white')
        .attr('y1', 0).attr('y2', 600));
}
function dragObj(svg, rect) {
    const mousedown = rect.observe('mousedown'), mousemove = Observable.fromEvent(svg, 'mousemove'), mousedownend = Observable.fromEvent(svg, 'mousedown');
    mousedown.subscribe(e => e.stopPropagation());
    rect.observe('mousedown')
        .map(({ clientX, clientY }) => ({ xOffset: Number(rect.attr('x')) - clientX,
        yOffset: Number(rect.attr('y')) - clientY }))
        .flatMap(({ yOffset }) => mousemove
        .takeUntil(mousedownend)
        .map(({ clientY }) => ({ y: clientY + yOffset })))
        .subscribe(({ y }) => rect.attr('y', y));
}
function dragRectPlayer(circle) {
    const svg = document.getElementById("canvas"), rect = new Elem(svg, 'rect')
        .attr('x', 50).attr('y', 250)
        .attr('width', 10).attr('height', 100)
        .attr('fill', 'white');
    dragObj(svg, rect);
    collision(rect, circle);
}
function incScore(player) {
    const svg = document.getElementById("canvas"), left = document.getElementById("left"), right = document.getElementById("right"), leftwin = document.getElementById("leftwin"), rightwin = document.getElementById("rightwin");
    player ? left.innerHTML = `${Number(left.innerHTML) + 1}` :
        right.innerHTML = `${Number(right.innerHTML) + 1}`;
    const o = Observable.interval(10);
    o.filter(_ => Number(left.innerHTML) == 11)
        .subscribe(_ => {
        leftwin.innerHTML = "Winner!",
            rightwin.innerHTML = "Loser!", svg.remove(), left.remove(), right.remove();
    });
    o.filter(_ => Number(right.innerHTML) == 11)
        .subscribe(_ => {
        rightwin.innerHTML = "Winner!";
        leftwin.innerHTML = "Loser!", svg.remove(), right.remove(), left.remove();
    });
}
function collision(paddle, ball) {
    const svg = document.getElementById("canvas");
    const o = Observable.interval(10);
    o.filter(() => (Number(paddle.attr('x')) <= Number(ball.attr('cx')) &&
        Number(paddle.attr('x')) + Number(paddle.attr('width')) >= Number(ball.attr('cx'))) &&
        (Number(ball.attr('cy')) <= Number(paddle.attr('y')) + Number(paddle.attr('height'))
            && Number(ball.attr('cy')) >= Number(paddle.attr('y'))))
        .subscribe(() => {
        ball.attr('xvel', -Number(ball.attr('xvel'))),
            ball.attr('yvel', -((Number(paddle.attr('y')) + Number(paddle.attr('height')) / 2)
                - Number(ball.attr('cy'))) / 20);
    });
}
function movingBall() {
    const svg = document.getElementById("canvas");
    let circle = new Elem(svg, 'circle')
        .attr('cx', 300).attr('cy', 300).attr('r', 4)
        .attr('fill', 'white').attr('xvel', -4).attr('yvel', 0);
    const o = Observable.interval(10);
    o.subscribe(() => {
        circle.attr('cx', Number(circle.attr('cx')) + Number(circle.attr('xvel'))),
            circle.attr('cy', Number(circle.attr('cy')) + Number(circle.attr('yvel')));
    });
    o.filter(() => Number(circle.attr('cx')) > 600)
        .subscribe(_ => {
        circle.attr('cx', 300), circle.attr('cy', 300);
        circle.attr('xvel', -4), circle.attr('yvel', 0)
            , incScore(true);
    });
    o.filter(() => Number(circle.attr('cx')) + Number(circle.attr('cx')) == 0)
        .subscribe(_ => {
        console.log(circle.attr('cx')), circle.attr('cx', 300), circle.attr('cy', 300);
        circle.attr('xvel', -4), circle.attr('yvel', 0)
            , incScore(false);
    });
    o.filter(() => (Number(circle.attr('cy')) > 600) || Number(circle.attr('cy')) < 0)
        .subscribe(_ => circle.attr('yvel', -Number(circle.attr('yvel'))));
    return circle;
}
function badPlayer(ball) {
    const svg = document.getElementById("canvas"), rect = new Elem(svg, 'rect')
        .attr('x', 550).attr('y', 250)
        .attr('width', 10).attr('height', 100)
        .attr('fill', 'white').attr('yvel', 1), o = Observable.interval(1);
    o.subscribe(() => rect.attr('y', Number(rect.attr('y')) + Number(rect.attr('yvel'))));
    o.filter(() => Number(ball.attr('cy')) < (Number(rect.attr('y')) + Number(rect.attr('height')) / 2))
        .subscribe(() => { rect.attr('yvel', -1), console.log(Number(rect.attr('y')) + Number(rect.attr('height')) / 2), console.log(ball.attr('cy')); });
    o.filter(() => Number(ball.attr('cy')) > (Number(rect.attr('y')) + Number(rect.attr('height')) / 2))
        .subscribe(() => { rect.attr('yvel', 1), console.log(rect.attr('y')), console.log(ball.attr('cy')); });
    collision(rect, ball);
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map