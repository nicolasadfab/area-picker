function Selection ( parent )
{
    'use strict';
    
    this.parent = parent;
    
    this.rx = $('<div />')
        .addClass('ruler-x')
        .width($(window).width())
        .height(1);
    this.rxInfo = $('<div />')
        .addClass('ruler-info');
        
    this.ry = $('<div />')
        .addClass('ruler-y')
        .width(1)
        .height($(window).height());
    this.ryInfo = $('<div />')
        .addClass('ruler-info');
        
    this.ele = $('<div />')
        .addClass('ruler-area')
        .hide();
    
    this.parent
        .append(this.rx)
        .append(this.ry)
        .append(this.ryInfo)
        .append(this.rxInfo)
        .append(this.ele);
    
    this.bindEvents();
}

Selection.prototype.bindEvents = function ()
{
    'use strict';
    
    var self = this,
        px, py, rulerVisible = false;
    
    this.parent.bind('mousemove', function (e)
    {
        e.preventDefault();
        
        px = $('#iframe-wrapper').scrollLeft() + e.clientX
                - parseInt(self.parent.css('left').replace(/px/g, ''), 10);
        py = $('#iframe-wrapper').scrollTop() + e.clientY
                - parseInt(self.parent.css('top').replace(/px/g, ''), 10);
        
        self.ryInfo
            .css({
                left: (px - 30) + 'px',
                top: (py + 15) + 'px'
            })
            .text(py + 'px');
            
        self.rxInfo
            .css({
                left: (px + 15) + 'px',
                top: (py - 15) + 'px'
            })
            .text(px + 'px');
        
        self.rx.css({
            top: py + 'px',
            left: $('#iframe-wrapper').scrollLeft() + 'px'
        });
        self.ry.css({
            top: $('#iframe-wrapper').scrollTop() + 'px',
            left: px + 'px'
        });
        
        if(rulerVisible) {
            self.ele.css({
                width: (px - parseInt(self.ele.css('left').replace(/px/g, ''), 10)) + 'px',
                height: (py - parseInt(self.ele.css('top').replace(/px/g, ''), 10)) + 'px'
            });
        }
        
        return false;
    });
    
    this.parent.bind('mousedown', function (e)
    {
        e.preventDefault();
        
        px = $('#iframe-wrapper').scrollLeft() + e.clientX
                - parseInt(self.parent.css('left').replace(/px/g, ''), 10);
        py = $('#iframe-wrapper').scrollTop() + e.clientY
                - parseInt(self.parent.css('top').replace(/px/g, ''), 10);
        
        self.ele.show()
            .css({
                left: px + 'px',
                top: py + 'px'
            });
        
        rulerVisible = true;
        
        return false;
    });
    
    this.parent.bind('mouseup', function (e)
    {
        e.preventDefault();
        
        self.parent.unbind('mousedown');
        self.parent.unbind('mousemove');
        self.parent.unbind('mouseup');
        
        self.complete();
        
        return false;
    });
};

Selection.prototype.complete = function ()
{
    'use strict';
        
    this.rx.remove();
    this.ry.remove();
    this.ryInfo.remove();
    this.rxInfo.remove();
    
    if(this.ele.width() < 10 || this.ele.height() < 10) {
        this.destroy();
    }
    
    this.ele
        .addClass('complete')
        .attr('data-width', this.ele.width())
        .attr('data-height', this.ele.height())
        .attr('data-top', this.ele.css('top').replace(/px/g, ''))
        .attr('data-left', this.ele.css('left').replace(/px/g, ''));
};

Selection.prototype.destroy = function ()
{
    'use strict';
    
    this.parent.unbind('mousedown');
    this.parent.unbind('mousemove');
    this.parent.unbind('mouseup');
    this.ele.remove();
};