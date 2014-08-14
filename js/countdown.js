/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*-
 * vim: set ts=8 sts=2 et sw=2 tw=99:
 */

// Countdown timer implementation, largely copied from gaia/apps/clock/js/stopwatch.js.

var Countdown = (function () {

  'use strict';

  var priv = new WeakMap();

  function Defaults() {
    this.intervalTime = 0;  // Time given for this interval, in msecs.
    this.startTime = 0;     // Time since epoch until countdown start, in msecs.
    this.totalElapsed = 0;  // Time elapsed so far, in msecs.
    this.state = Countdown.PAUSED;
  }

  function Countdown(opts = {}) {
    var defaults = new Defaults();
    var obj = {};

    obj.intervalTime = opts.intervalTime || defaults.intervalTime;
    obj.startTime = opts.startTime || defaults.startTime;
    obj.totalElapsed = opts.totalElapsed || defaults.totalElapsed;
    obj.state = opts.state || defaults.state;

    priv.set(this, obj);
  }

  Countdown.RUNNING = 'RUNNING';
  Countdown.PAUSED = 'PAUSED';

  Countdown.prototype = {

    constructor: Countdown,

    getState: function() {
      var cd = priv.get(this);
      return cd.state;
    },

    setState: function(state) {
      var cd = priv.get(this);
      cd.state = state;
    },

    // Starts the countdown, either from a reset or paused state.
    start: function cd_start() {
      var cd = priv.get(this);
      if (cd.state === Countdown.RUNNING) {
        return;
      }
      var now = Date.now() - cd.totalElapsed;
      cd.startTime = now;
      this.setState(Countdown.RUNNING);
    },

    // Calculates the total elapsed duration since the countdown was started.
    getElapsedTime: function cd_getElapsedTime() {
      var cd = priv.get(this);
      var elapsed = 0;
      if (cd.state === Countdown.RUNNING) {
        elapsed = Date.now() - cd.startTime;
      } else {
        elapsed = cd.totalElapsed;
      }
      return elapsed;
    },

    // Calculates the remaining duration of the interval since the countdown was started.
    getRemainingTime: function cd_getRemainingTime() {
      var cd = priv.get(this);
      var elapsed = 0;
      if (cd.state === Countdown.RUNNING) {
        elapsed = Date.now() - cd.startTime;
      } else {
        elapsed = cd.totalElapsed;
      }
      return cd.intervalTime - elapsed;
    },

    // Pauses the countdown.
    pause: function cd_pause() {
      var cd = priv.get(this);
      if (cd.state === Countdown.PAUSED) {
        return;
      }
      cd.totalElapsed = Date.now() - cd.startTime;
      this.setState(Countdown.PAUSED);
    },

    // Resets the countdown. Used to start a new interval.
    reset: function cd_set(opts = {}) {
      priv.set(this, new Timer(opts));
    }
  };

  return Countdown;
})();
