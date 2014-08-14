/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 * vim: set ts=8 sts=4 et sw=4 tw=99:
 */

var clock = null; // Set on document ready.
var countdown = null; // Interval set on timer start.
var button = document.getElementById("startButton");

var vibrateNextTick = false;

var totalTime = 0; // Total time spent on the training.
var times = [
    300, // 5 minute warmup
    20,  // 20 seconds all-out 1
    100, // 1m40s light effort
    20,  // 20 seconds all-out 2
    100, // 1m40s light effort
    20,  // 20 seconds all-out 3
    100, // 1m40s light effort
    20,  // 20 seconds all-out 4
    100, // 1m40s light effort
    20,  // 20 seconds all-out 5
    100, // 1m40s light effort
    20,  // 20 seconds all-out 6
    100, // 1m40s light effort
    20,  // 20 seconds all-out 7
    600  // 10 minute cooldown
];

function startTimer() {
    if (countdown !== null)
        clearInterval(countdown);

    totalTime = 0;
    clock.setCounter(times[0]);
    countdown = setInterval(tickTimer, 1000);
}

function stopTimer() {
    clearInterval(countdown);
    countdown = null;
}

function getCurrentIntervalIndex(totalElapsed, intervals) {
    var acc = 0;
    for (var i = 0; i < intervals.length; i++) {
        acc += intervals[i];
        if (totalElapsed < acc)
            return i;
    }
    return -1;
}

function tickTimer() {
    var timeObj = clock.getTime();
    var seconds = timeObj.getTimeSeconds();
    
    totalTime += 1;

    if (vibrateNextTick === true) {
        window.navigator.vibrate(500);
        vibrateNextTick = false;
    }

    // Transition point
    if (seconds === 1) {
        // Get the next interval.
        var index = getCurrentIntervalIndex(totalTime + 1, times);

        // No interval returned: display zero.
        if (index === -1) {
            clock.setCounter(0);
            stopTimer();
            return;
        }

        // Flip to the next interval, bypassing zero.
        clock.setCounter(times[index]);
        vibrateNextTick = true;
        return;
    }

    clock.decrement();
}

$(document).ready(function() {
    clock = $('.clock').FlipClock(times[0], {
        clockFace: 'Counter',
        minimumDigits: 3
    });

    button.addEventListener("click", startTimer, false);
});
