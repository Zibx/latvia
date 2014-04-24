var Cfg = {
  spinner: {
    lines: 9, // The number of lines to draw
    length: 14, // The length of each line
    width: 2, // The line thickness
    radius: 15, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 21, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#534741', // #rgb or #rrggbb or array of colors
    speed: 1.3, // Rounds per second
    trail: 30, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent in px
    left: '50%' // Left position relative to parent in px
  }
};