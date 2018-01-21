var _ = require('lodash');

// 非透明度
var _opacityNone = 255;
// 半透明度
var _opacityHalf = 100;
// 全透明度
var _opacityAll = 0;

var _totalB = 35;
var _totalR = 12;
var _randB = 5;
var _randR = 2;

cc.Class({
    extends: cc.Component,

    properties: {
        BallPoolB: cc.Node,
        BallB: cc.Node,
        BallPoolR: cc.Node,
        BallR: cc.Node,

        __DataSourceR: [],
        __DataSourceB: [],
    },

    onLoad: function() {
        this.node.opacity = _opacityAll;

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchMove: function(event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        if (this._touchSrcX === null)
            this._touchSrcX = touchLoc.x;
        var moveX = touchLoc.x - this._touchSrcX;
        this.node.position = cc.v2(this.node.position.x + moveX, 0);
        if (this.node.position.x < 0)
            this.node.position = cc.v2(0, 0);

        this._touchSrcX = touchLoc.x;
    },

    onTouchEnd: function() {
        this._touchSrcX = null;
        if (this.node.position.x >= 100)
            this.onCloseHandler();
        else
            this.node.runAction(
                cc.moveTo(0.05, cc.p(0, 0))
            );
    },

    start: function() {
        this.initData();
        this.initUI();
    },

    show: function() {
        this.node.runAction(
            cc.spawn(
                cc.moveTo(0.2, cc.p(0, 0)),
                cc.fadeIn(0.2)
            )
        );
    },

    hide: function() {
        this.node.runAction(
            cc.spawn(
                cc.moveTo(0.2, cc.p(cc.director.getVisibleSize().width, 0)),
                cc.fadeOut(0.2)
            )
        );
    },

    initData: function() {
        this.__DataSourceB = [undefined];
        for (var i = 1; i <= _totalB; i++) {
            this.__DataSourceB.push(i);
        }
        this.__DataSourceR = [undefined];
        for (var i = 1; i <= _totalR; i++) {
            this.__DataSourceR.push(i);
        }
    },

    initUI: function() {
        this.BallPoolB.removeAllChildren();
        for (var i = 1; i <= _totalB; i++) {
            var ball = cc.instantiate(this.BallB);
            this.BallPoolB.addChild(ball);
            ball.getChildByName('lb').getComponent(cc.Label).string = i + '';
        }
        this.BallPoolR.removeAllChildren();
        for (var i = 1; i <= _totalR; i++) {
            var ball = cc.instantiate(this.BallR);
            this.BallPoolR.addChild(ball);
            ball.getChildByName('lb').getComponent(cc.Label).string = i + '';
        }
    },

    resetBalls: function(isAll) {
        _.forEach(this.BallPoolB.children, function(ball) {
            if (isAll || (!isAll && ball.opacity !== _opacityAll)) {
                if (isAll) ball.opacity = _opacityNone;
                ball.getChildByName('select').active = false;
                ball.getChildByName('lb').color = new cc.Color(0, 0, 0);
            }
        });
        _.forEach(this.BallPoolR.children, function(ball) {
            if (isAll || (!isAll && ball.opacity !== _opacityAll)) {
                if (isAll) ball.opacity = _opacityNone;
                ball.getChildByName('select').active = false;
                ball.getChildByName('lb').color = new cc.Color(0, 0, 0);
            }
        });
    },

    onBallBHandler: function(target) {
        if (target.currentTarget.opacity === _opacityAll) return;

        target.currentTarget.opacity = target.currentTarget.opacity === _opacityNone ? _opacityHalf : _opacityNone;
    },

    onBallRHandler: function(target) {
        if (target.currentTarget.opacity === _opacityAll) return;

        target.currentTarget.opacity = target.currentTarget.opacity === _opacityNone ? _opacityHalf : _opacityNone;
    },

    // 重置
    onResetHandler: function() {
        this.initData();
        this.resetBalls(true);
    },

    // 销毁
    onDestroyHandler: function() {
        var that = this;
        _.forEach(this.BallPoolB.children, function(ball) {
            if (ball.opacity === _opacityHalf) {
                ball.opacity = _opacityAll;
                _.remove(that.__DataSourceB, function(data) {
                    return data === Number(ball.getChildByName('lb').getComponent(cc.Label).string);
                });
            }
        });
        _.forEach(this.BallPoolR.children, function(ball) {
            if (ball.opacity === _opacityHalf) {
                ball.opacity = _opacityAll;
                _.remove(that.__DataSourceR, function(data) {
                    return data === Number(ball.getChildByName('lb').getComponent(cc.Label).string);
                });
            }
        });
    },

    // 随机
    onRandHandler: function() {
        this.resetBalls(false);

        var tmp_DataSourceB = this.__DataSourceB.slice(0);
        var resultB = [];
        for (var i = 0; i < _randB; i++) {
            if (tmp_DataSourceB.length <= 1) break;
            var index = _.random(1, tmp_DataSourceB.length - 1);
            resultB[i] = tmp_DataSourceB[index];
            _.remove(tmp_DataSourceB, function(num) { return num === resultB[i]; });
        }
        if (resultB.length < _randB) return;

        var tmp_DataSourceR = this.__DataSourceR.slice(0);
        var resultR = [];
        for (var i = 0; i < _randR; i++) {
            if (tmp_DataSourceR.length <= 1) break;
            var index = _.random(1, tmp_DataSourceR.length - 1);
            resultR[i] = tmp_DataSourceR[index];
            _.remove(tmp_DataSourceR, function(num) { return num === resultR[i]; });
        }
        if (resultR.length < _randR) return;

        _.forEach(this.BallPoolB.children, function(ball) {
            if (_.find(resultB, function(data) { return Number(ball.getChildByName('lb').getComponent(cc.Label).string) === data; })) {
                ball.getChildByName('select').active = true;
                ball.getChildByName('lb').color = new cc.Color(255, 255, 255);
            }
        });
        _.forEach(this.BallPoolR.children, function(ball) {
            if (_.find(resultR, function(data) { return Number(ball.getChildByName('lb').getComponent(cc.Label).string) === data; })) {
                ball.getChildByName('select').active = true;
                ball.getChildByName('lb').color = new cc.Color(255, 255, 255);
            }
        });
    },

    // 隐藏
    onCloseHandler: function() {
        this.initData();
        this.resetBalls(true);

        this.hide();
    },
});