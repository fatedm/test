/*
 * @version: 1-0-0
 * ʱ����
 * param: config
 *      container: @string
 *      width: @number{timeline width, default: 800}
 *      amount: @number{seperator amount}
 */
KISSY.add('timeline', function(S, Base, D, E, Anim){
    function Timeline(config) {
        var defaultConfig = {
            min: 0,
            width: 800
        };

        this.config = S.merge(defaultConfig, config);

        this._init();
    }

    S.augment(Timeline, S.EventTarget, {
        _init: function() {
            //������֤
            if (!this.config.container ||
                !D.get(this.config.container) ||
                !this.config.amount) {
                S.log('Parameter mismatch');
                return false;
            }

            //���浱ǰ�α��λ��
            this.x = 0;

            this.container = D.get(this.config.container);

            this._render();

        },

        //����config��ʼ������
        _render: function() {
            var config = this.config,
                amount = config.amount,
                width = config.width,
                per =  this.per = width / amount,
                i = 0,
                //�̶�
                tmp_mark = '<div class="timeline-mask"></div><i></i>',
                //�����̶ȺͿ̶ȳߵ�����
                tmp_marks = '',
                //�α�
                tmp_trigger = '<i class="timeline-trigger"></i> ';

            for(; i < amount + 1; i++) {
                tmp_mark += '<s style="left:' + per*i + 'px"><span>'
                    + i
                    + '</span></s>';
            }

            tmp_marks = '<div class="timeline-mark">'
                + tmp_mark
                + '</div>'

            D.html(this.container, tmp_marks + tmp_trigger);

            this._bindEvent();
        },

        //�󶨹����¼�
        _bindEvent: function() {
            var self = this,
                config = self.config,
                container = self.container,
                max = config.width,
                trigger = D.get('.timeline-trigger', container),
                cx, cy,
                draging = false;


            E.on(trigger, 'mousedown', function(e){
//                D.attr(trigger, 'draging', 'true');

                cx = e.clientX;
                draging = true;
                E.on(document, 'mousemove', function(e){
                    e.preventDefault();
                    if (draging /*&& D.attr(trigger, 'draging')*/) {
                        var _x = e.clientX - cx,
                            x = Math.min(max, Math.max(0, self.x + _x));

                        cx = e.clientX;
                        self.x = x;

                        D.css(trigger, {left: self.x + 'px'});
                        console.log('this.x = ' + self.x);
                    }
                });

                E.on(document, 'mouseup mouseleave', function(e){
                    e.preventDefault();
                    console.log('mouseup');
                    draging = false;
                    self.fire('change', {});
                    E.detach(document, 'mousemove');
                    E.detach(document, 'mouseup');
                    E.detach(document, 'mouseleave');
                });
            });


        }
    });

    return Timeline;
}, {
    requires: [
        'base',
        'dom',
        'event',
        'anim'
    ]
});
KISSY.use('timeline', function(S, Timeline){
    new Timeline({
        container: '.timeline',
        amount: 30
    });
});