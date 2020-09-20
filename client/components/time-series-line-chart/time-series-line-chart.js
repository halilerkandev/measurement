import { useEffect } from 'react';
import * as d3 from 'd3';
import * as _ from 'underscore';

import { metricValue, metricDates } from './example-data';

export const TimeSeriesLineChart = ({
  optheight,
  optwidth,
  filteredMetrics,
}) => {
  const createTimeSeriesLineChart = () => {
    const timeFormat = (formats) => {
      return function (date) {
        var i = formats.length - 1,
          f = formats[i];
        while (!f[1](date)) f = formats[--i];
        return f[0](date);
      };
    };

    const customTickFunction = (t0, t1, dt) => {
      var labelSize = 42;
      var maxTotalLabels = Math.floor(width / labelSize);

      function step(date, offset) {
        date.setMonth(date.getMonth() + offset);
      }

      var time = d3.time.month.ceil(t0),
        times = [],
        monthFactors = [1, 3, 4, 12];

      while (time < t1) times.push(new Date(+time)), step(time, 1);
      var timesCopy = times;
      var i;
      for (i = 0; times.length > maxTotalLabels; i++)
        times = _.filter(timesCopy, function (d) {
          return d.getMonth() % monthFactors[i] == 0;
        });

      return times;
    };

    // === brush and zoom functions ===

    const brushed = () => {
      x.domain(brush.empty() ? x2.domain() : brush.extent());
      focus.select('.area').attr('d', area);
      focus.select('.line').attr('d', line);
      focus.select('.x.axis').call(xAxis);
      // Reset zoom scale's domain
      zoom.x(x);
      updateDisplayDates();
      setYdomain();
    };

    const draw = () => {
      setYdomain();
      focus.select('.area').attr('d', area);
      focus.select('.line').attr('d', line);
      focus.select('.x.axis').call(xAxis);
      //focus.select(".y.axis").call(yAxis);
      // Force changing brush range
      brush.extent(x.domain());
      vis.select('.brush').call(brush);
      // and update the text showing range of dates.
      updateDisplayDates();
    };

    const brushend = () => {
      // when brush stops moving:

      // check whether chart was scrolled out of bounds and fix,
      var b = brush.extent();
      var out_of_bounds = brush.extent().some(function (e) {
        return (e < mindate) | (e > maxdate);
      });
      if (out_of_bounds) {
        b = moveInBounds(b);
      }
    };

    const updateDisplayDates = () => {
      var b = brush.extent();
      // update the text that shows the range of displayed dates
      var localBrushDateStart = brush.empty()
          ? DateFormat(dataXrange[0])
          : DateFormat(b[0]),
        localBrushDateEnd = brush.empty()
          ? DateFormat(dataXrange[1])
          : DateFormat(b[1]);

      // Update start and end dates in upper right-hand corner
      d3.select('#displayDates').text(
        localBrushDateStart == localBrushDateEnd
          ? localBrushDateStart
          : localBrushDateStart + ' - ' + localBrushDateEnd
      );
    };

    const moveInBounds = (b) => {
      // move back to boundaries if user pans outside min and max date.

      var ms_in_year = 31536000000,
        brush_start_new,
        brush_end_new;

      if (b[0] < mindate) {
        brush_start_new = mindate;
      } else if (b[0] > maxdate) {
        brush_start_new = new Date(maxdate.getTime() - ms_in_year);
      } else {
        brush_start_new = b[0];
      }

      if (b[1] > maxdate) {
        brush_end_new = maxdate;
      } else if (b[1] < mindate) {
        brush_end_new = new Date(mindate.getTime() + ms_in_year);
      } else {
        brush_end_new = b[1];
      }

      brush.extent([brush_start_new, brush_end_new]);

      brush(d3.select('.brush').transition());
      brushed();
      draw();

      return brush.extent();
    };

    const setYdomain = () => {
      // this function dynamically changes the y-axis to fit the data in focus

      // get the min and max date in focus
      var xleft = new Date(x.domain()[0]);
      var xright = new Date(x.domain()[1]);

      // a function that finds the nearest point to the right of a point
      var bisectDate = d3.bisector(function (d) {
        return d.month;
      }).right;

      // get the y value of the line at the left edge of view port:
      var iL = bisectDate(dataset, xleft);

      if (dataset[iL] !== undefined && dataset[iL - 1] !== undefined) {
        var left_dateBefore = dataset[iL - 1].month,
          left_dateAfter = dataset[iL].month;

        var intfun = d3.interpolateNumber(
          dataset[iL - 1].value,
          dataset[iL].value
        );
        var yleft = intfun(
          (xleft - left_dateBefore) / (left_dateAfter - left_dateBefore)
        );
      } else {
        var yleft = 0;
      }

      // get the x value of the line at the right edge of view port:
      var iR = bisectDate(dataset, xright);

      if (dataset[iR] !== undefined && dataset[iR - 1] !== undefined) {
        var right_dateBefore = dataset[iR - 1].month,
          right_dateAfter = dataset[iR].month;

        var intfun = d3.interpolateNumber(
          dataset[iR - 1].value,
          dataset[iR].value
        );
        var yright = intfun(
          (xright - right_dateBefore) / (right_dateAfter - right_dateBefore)
        );
      } else {
        var yright = 0;
      }

      // get the y values of all the actual data points that are in view
      var dataSubset = dataset.filter(function (d) {
        return d.month >= xleft && d.month <= xright;
      });
      var valueSubset = [];
      dataSubset.map(function (d) {
        valueSubset.push(d.value);
      });

      // add the edge values of the line to the array of values in view, get the max y;
      valueSubset.push(yleft);
      valueSubset.push(yright);
      var ymax_new = d3.max(valueSubset);

      if (ymax_new == 0) {
        ymax_new = dataYrange[1];
      }

      // reset and redraw the yaxis
      y.domain([0, ymax_new * 1.05]);
      focus.select('.y.axis').call(yAxis);
    };

    const scaleDate = (d, i) => {
      // action for buttons that scale focus to certain time interval

      var b = brush.extent(),
        interval_ms,
        brush_end_new,
        brush_start_new;

      if (d == 'Son 10 dk') {
        interval_ms = 600000;
      } else if (d == 'Son 30 dk') {
        interval_ms = 1800000;
      }

      if (d == 'Son 10 dk') {
        if (maxdate.getTime() - b[1].getTime() < interval_ms) {
          // if brush is too far to the right that increasing the right-hand brush boundary would make the chart go out of bounds....
          brush_start_new = new Date(maxdate.getTime() - interval_ms); // ...then decrease the left-hand brush boundary...
          brush_end_new = maxdate; //...and set the right-hand brush boundary to the maxiumum limit.
        } else {
          // otherwise, increase the right-hand brush boundary.
          brush_start_new = b[0];
          brush_end_new = new Date(b[0].getTime() + interval_ms);
        }
      } else if (d == 'Son 30 dk') {
        brush_start_new = dataXrange[0];
        brush_end_new = dataXrange[1];
      } else {
        brush_start_new = b[0];
        brush_end_new = b[1];
      }

      brush.extent([brush_start_new, brush_end_new]);

      // now draw the brush to match our extent
      brush(d3.select('.brush').transition());
      // now fire the brushstart, brushmove, and brushend events
      brush.event(d3.select('.brush').transition());
    };
    /*
     * ========================================================================
     *  Prepare data
     * ========================================================================
     */

    // Combine the months and value array to make "data"
    var dataset = [];
    for (var i = 0; i < metricValue.length; i++) {
      var obj = { value: metricValue[i], month: metricDates[i] };
      dataset.push(obj);
    }

    // format month as a date
    dataset.forEach(function (d) {
      d.month = d3.time.format('%Y-%m').parse(d.month);
    });

    // sort dataset by month
    dataset.sort(function (x, y) {
      return d3.ascending(x.month, y.month);
    });

    /*
     * ========================================================================
     *  sizing
     * ========================================================================
     */

    /* === Focus chart === */

    var margin = { top: 20, right: 30, bottom: 100, left: 20 },
      width = optwidth - margin.left - margin.right,
      height = optheight - margin.top - margin.bottom;

    /* === Context chart === */

    var margin_context = { top: 320, right: 30, bottom: 20, left: 20 },
      height_context = optheight - margin_context.top - margin_context.bottom;

    /*
     * ========================================================================
     *  x and y coordinates
     * ========================================================================
     */

    // the date range of available data:
    var dataXrange = d3.extent(dataset, function (d) {
      return d.month;
    });
    var dataYrange = [
      0,
      d3.max(dataset, function (d) {
        return d.value;
      }),
    ];

    // maximum date range allowed to display
    var mindate = dataXrange[0], // use the range of the data
      maxdate = dataXrange[1];

    var DateFormat = d3.time.format('%I:%M');

    var dynamicDateFormat = timeFormat([
      [
        d3.time.format('%Y'),
        function () {
          return true;
        },
      ], // <-- how to display when Jan 1 YYYY
      [
        d3.time.format('%b %Y'),
        function (d) {
          return d.getMonth();
        },
      ],
      [
        function () {
          return '';
        },
        function (d) {
          return d.getDate() != 1;
        },
      ],
    ]);

    // var dynamicDateFormat =  timeFormat([
    //     [d3.time.format("%Y"), function() { return true; }],
    //     [d3.time.format("%b"), function(d) { return d.getMonth(); }],
    //     [function(){return "";}, function(d) { return d.getDate() != 1; }]
    // ]);

    /* === Focus Chart === */

    var x = d3.time.scale().range([0, width]).domain(dataXrange);

    var y = d3.scale.linear().range([height, 0]).domain(dataYrange);

    var xAxis = d3.svg
      .axis()
      .scale(x)
      .orient('bottom')
      .tickSize(-height)
      .ticks(customTickFunction)
      .tickFormat(dynamicDateFormat);

    var yAxis = d3.svg
      .axis()
      .scale(y)
      .ticks(4)
      .tickSize(-width)
      .orient('right');

    /* === Context Chart === */

    var x2 = d3.time.scale().range([0, width]).domain([mindate, maxdate]);

    var y2 = d3.scale.linear().range([height_context, 0]).domain(y.domain());

    var xAxis_context = d3.svg
      .axis()
      .scale(x2)
      .orient('bottom')
      .ticks(customTickFunction)
      .tickFormat(dynamicDateFormat);

    /*
     * ========================================================================
     *  Plotted line and area variables
     * ========================================================================
     */

    /* === Focus Chart === */

    var line = d3.svg
      .line()
      .x(function (d) {
        return x(d.month);
      })
      .y(function (d) {
        return y(d.value);
      });

    var area = d3.svg
      .area()
      .x(function (d) {
        return x(d.month);
      })
      .y0(height)
      .y1(function (d) {
        return y(d.value);
      });

    /* === Context Chart === */

    var area_context = d3.svg
      .area()
      .x(function (d) {
        return x2(d.month);
      })
      .y0(height_context)
      .y1(function (d) {
        return y2(d.value);
      });

    var line_context = d3.svg
      .line()
      .x(function (d) {
        return x2(d.month);
      })
      .y(function (d) {
        return y2(d.value);
      });

    /*
     * ========================================================================
     *  Variables for brushing and zooming behaviour
     * ========================================================================
     */

    var brush = d3.svg
      .brush()
      .x(x2)
      .on('brush', brushed)
      .on('brushend', brushend);

    var zoom = d3.behavior.zoom().on('zoom', draw).on('zoomend', brushend);

    /*
     * ========================================================================
     *  Define the SVG area ("vis") and append all the layers
     * ========================================================================
     */

    // === the main components === //

    var vis = d3
      .select('#metric-modal')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'metric-chart'); // CB -- "line-chart" -- CB //

    vis
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);
    // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

    var context = vis
      .append('g')
      .attr('class', 'context')
      .attr(
        'transform',
        'translate(' + margin_context.left + ',' + margin_context.top + ')'
      );

    var focus = vis
      .append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var rect = vis
      .append('svg:rect')
      .attr('class', 'pane')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom)
      .call(draw);

    // === current date range text & zoom buttons === //

    var display_range_group = vis
      .append('g')
      .attr('id', 'buttons_group')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    let expl_text = display_range_group
      .append('text')
      .text('Zaman aralığı: ')
      .style('text-anchor', 'start')
      .attr('transform', 'translate(' + 0 + ',' + 10 + ')');

    display_range_group
      .append('text')
      .attr('id', 'displayDates')
      .text(DateFormat(dataXrange[0]) + ' - ' + DateFormat(dataXrange[1]))
      .style('text-anchor', 'start')
      .attr('transform', 'translate(' + 62 + ',' + 10 + ')');

    // expl_text = display_range_group
    //   .append('text')
    //   .text('Odaklan: ')
    //   .style('text-anchor', 'start')
    //   .attr('transform', 'translate(' + 180 + ',' + 10 + ')');

    // === the zooming/scaling buttons === //

    var button_width = 60;
    var button_height = 14;

    // don't show year button if < 1 year of data
    var dateRange = dataXrange[1] - dataXrange[0],
      ms_in_year = 31540000000;

    let button_data = ['Son 10 dk', 'Son 30 dk'];

    var button = display_range_group
      .selectAll('g')
      .data(button_data)
      .enter()
      .append('g')
      .attr('class', 'scale_button')
      .attr('transform', function (d, i) {
        return 'translate(' + (140 + i * button_width + i * 10) + ',0)';
      })
      .on('click', scaleDate);

    button
      .append('rect')
      .attr('width', button_width)
      .attr('height', button_height)
      .attr('rx', 1)
      .attr('ry', 1);

    button
      .append('text')
      .attr('dy', button_height / 2 + 3)
      .attr('dx', button_width / 2)
      .style('text-anchor', 'middle')
      .text(function (d) {
        return d;
      });

    /* === focus chart === */

    focus
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .attr('transform', 'translate(' + width + ', 0)');

    focus.append('path').datum(dataset).attr('class', 'area').attr('d', area);

    focus
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    focus.append('path').datum(dataset).attr('class', 'line').attr('d', line);

    /* === context chart === */

    context
      .append('path')
      .datum(dataset)
      .attr('class', 'area')
      .attr('d', area_context);

    context
      .append('path')
      .datum(dataset)
      .attr('class', 'line')
      .attr('d', line_context);

    context
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height_context + ')')
      .call(xAxis_context);

    /* === brush (part of context chart)  === */

    var brushg = context.append('g').attr('class', 'x brush').call(brush);

    brushg
      .selectAll('.extent')
      .attr('y', -6)
      .attr('height', height_context + 8);
    // .extent is the actual window/rectangle showing what's in focus

    brushg
      .selectAll('.resize')
      .append('rect')
      .attr('class', 'handle')
      .attr('transform', 'translate(0,' + -3 + ')')
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('height', height_context + 6)
      .attr('width', 3);

    brushg
      .selectAll('.resize')
      .append('rect')
      .attr('class', 'handle-mini')
      .attr('transform', 'translate(-2,8)')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('height', height_context / 2)
      .attr('width', 7);
    // .resize are the handles on either size
    // of the 'window' (each is made of a set of rectangles)

    /* === y axis title === */

    vis
      .append('text')
      .attr('class', 'y axis title')
      .text('ms')
      .attr('x', -(height / 2))
      .attr('y', 0)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle');

    // allows zooming before any brush actio
    zoom.x(x);
  };

  useEffect(() => {
    createTimeSeriesLineChart();
  }, []);

  return <div id='metric-modal' />;
};
