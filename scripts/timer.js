/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 * vim: set ts=8 sts=4 et sw=4 tw=99:
 */

var clock = null; // Set on document ready.
var countdown = null; // Interval set on timer start.
var button = document.getElementById("startButton");

var totalTime = 0; // Total time spent on the training.
var times = [
    300, // 5 minute warmup
    20, // 20 seconds all-out 1
    100, // 1m40s light effort
    20, // 20 seconds all-out 2
    100, // 1m40s light effort
    20, // 20 seconds all-out 3
    100, // 1m40s light effort
    20, // 20 seconds all-out 4
    100, // 1m40s light effort
    20, // 20 seconds all-out 5
    100, // 1m40s light effort
    20, // 20 seconds all-out 6
    600 // 10 minute cooldown
];

function startTimer() {
    if (countdown !== null)
        clearInterval(countdown);

    totalTime = 0;
    clock.setTime(times[0]);
    countdown = setInterval(tickTimer, 1000);
}

function stopTimer() {
    clearInterval(countdown);
    countdown = null;
}

function getCurrentIntervalIndex(time, intervals) {
    var acc = 0;
    for (var i = 0; i < intervals.length; i++) {
        acc += intervals[i];
        if (time <= acc)
            return i;
    }
    return -1;
}

function tickTimer() {
    var timeObj = clock.getTime();
    var seconds = timeObj.getTimeSeconds();
    
    totalTime += 1;

    // Transition point
    if (seconds === 0) {
        window.navigator.vibrate(500);
        var index = getCurrentIntervalIndex(totalTime, times);

        if (index === -1) {
            stopTimer();
            return;
        }

        clock.setTime(times[index]);
    }

    clock.decrement();
}

$(document).ready(function() {
    clock = $('.clock').FlipClock(999, {
        clockFace: 'Counter'
    });

    button.addEventListener("click", startTimer, false);
});
