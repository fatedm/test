(function ($, undefined) {

    window.Timeline = Timeline;
    function Timeline (con, num) {
        this.holder = document.getElementById('timeline-holder');
        this.indicator = document.getElementById('timeline-indicator');
        this.graduationCon = document.getElementById('timeline-graduation');

        this.initialize(num);
    }

    Timeline.prototype = {
        initialize: function (num) {
            var that = this;

            this.width = this.holder.offsetWidth;

            $(this.indicator).makeDraggable({
                minX: -5, maxX: this.width - 5, maxY: -7,minY: -7
            });

            this.setGraduation(num || 12);

            var dragInstance = $(this.indicator).data('make-draggable');

            dragInstance.on('dragend', function (x) {
                that.onDragend(x, dragInstance);
            });

        },
        setGraduation: function (num) {
            this.num = num;

            var width = this.width;
            this.graduationCon.innerHTML = '';
            var html = '';
            for (var i = 0; i <= num; i++) {
                html += this.getItemHtml(i, num, width);
            }
            this.graduationCon.innerHTML = html;
        },
        getItemHtml: function (index, total, width) { // according indx and total return the item html
            return '<span style="left: '+ parseInt(index*(width/total)) +'px;"><em style="position:relative;left:-3px; top:10px;">'+index+'</em></span>';
        },
        onDragend: function (x, ins) {
            x += 5;
            var w = this.width / this.num,
                index = Math.floor(x/w);

            if (w/2 < x%w) {
                index++;
            }

            ins.setPosition(index*w-5);

            this.trigger('change', index, this.num);
        },
        /*
         *  Des: implement custome event
         */
        event: null,
        on: function (type, f) {
            this.event = event || {};
            this.event[type] = f;

        },
        trigger: function (type /* data args... */) {
            if (this.event && this.event[type]) {
                this.event[type].apply(null, Array.prototype.slice.call(arguments, 1));
            }
        },
        off: function (type) {
            if (typeof type === 'string' && this.event && this.event[type]) {
                delete this.event[type];
            } else {
                this.event = null;
            }
        }
    };


    /*
     *  Des: extend jquery to support making el be draggable
     */
    $.fn.makeDraggable = function (rangeConfig) {
        this.each(function () {
            if (!$(this).data('make-draggable')) {
                $(this).data('make-draggable', new Drag(this, rangeConfig));
            }
        });
    };
    $.fn.destroyDraggable = function () {
        this.each(function () {
            var ins = $(this).data('make-draggable');
            if (ins) {
                ins.destroy();
                $(this).removeData('make-draggable');
            }
        });
    };


    /*
     *  Des: make a element be draggable
     */
    function Drag (el, range) {
        var that = this;

        range = $.extend({
            minX: 0, minY: 0,
            maxX: 100, maxY: 100,
            step: 2,
        }, range);


        var x, y, currentX = el.offsetLeft, currentY = el.offsetTop;

        var mousedown = function (e) {
            e.preventDefault();
            $(document).on('mousemove', mousemove).on('mouseup', mouseup);
            x = e.clientX, y = e.clientY;
        };
        var mouseup = function () {
            $(document).off('mousemove', mousemove).off('mouseup', mouseup);

            that.trigger('dragend', currentX, currentY);
        };
        var mousemove = function (e) {
            var ox = currentX, oy = currentY,
                dx = e.clientX - x,
                dy = e.clientY -y;

            if (Math.abs(dx) >= range.step) {
                currentX = Math.max(Math.min(ox +dx, range.maxX), range.minX);
                el.style.left = currentX + 'px';
                x += currentX - ox;
            }
            if (Math.abs(dy) >= range.step) {
                currentY = Math.max(Math.min(oy + dy, range.maxY), range.minY);
                el.style.top = currentY + 'px';
                y += currentY - oy;
            }

            // if (ox !== currentX || oy !== currentY) {
            //     that.trigger('dragging', currentX, currentY);
            // }
        };

        this.setPosition = function (x, y) {
            if (x !== undefined) {
                currentX = Math.max(Math.min(x, range.maxX), range.minX);
            }
            if (y !== undefined) {
                currentY = Math.max(Math.min(y, range.maxY), range.minY);
            }
            el.style.left = currentX + 'px';
            el.style.top = currentY + 'px';

        };


        $(el).on('mousedown', mousedown);

        this.destroy = function () {
            $(el).off('mousedown', mousedown);
        };
    }
    Drag.prototype = {
        /*
         *  Des: implement custome event
         */
        event: null,
        on: function (type, f) {
            this.event = event || {};
            this.event[type] = f;

        },
        trigger: function (type /* data args... */) {
            if (this.event && this.event[type]) {
                this.event[type].apply(null, Array.prototype.slice.call(arguments, 1));
            }
        },
        off: function (type) {
            if (typeof type === 'string' && this.event && this.event[type]) {
                delete this.event[type];
            } else {
                this.event = null;
            }
        }
    };


})(jQuery, undefined);


var t = new Timeline(null, 20);
t.on('change', function (index, total) {
    $('#output').text('Total:' + total + ' , you select:' + index);
});/**
 * Created with JetBrains PhpStorm.
 * User: mingming.dmm
 * Date: 13-9-23
 * Time: ÏÂÎç7:44
 * To change this template use File | Settings | File Templates.
 */
