var _ = require('lodash');

// 非透明度
var _opacityNone = 255;
// 半透明度
var _opacityHalf = 100;
// 全透明度
var _opacityAll = 0;

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
    },

    start: function() {
        this.initData();
        this.initUI();

        this.node.opacity = _opacityNone;
    },

    initData: function() {
        this.__DataSourceB = [undefined];
        for (var i = 1; i <= 33; i++) {
            this.__DataSourceB.push(i);
        }
        this.__DataSourceR = [undefined];
        for (var i = 1; i <= 12; i++) {
            this.__DataSourceR.push(i);
        }
    },

    initUI: function() {
        this.BallPoolB.removeAllChildren();
        for (var i = 1; i <= 33; i++) {
            var ball = cc.instantiate(this.BallB);
            this.BallPoolB.addChild(ball);
            ball.getChildByName('lb').getComponent(cc.Label).string = i + '';
        }
        this.BallPoolR.removeAllChildren();
        for (var i = 1; i <= 12; i++) {
            var ball = cc.instantiate(this.BallR);
            this.BallPoolR.addChild(ball);
            ball.getChildByName('lb').getComponent(cc.Label).string = i + '';
        }
    },

    resetRestBall: function() {
        _.forEach(this.BallPoolB.children, function(ball) {
            if (ball.opacity !== _opacityAll) {
                // 熄灭Ball
            }
        });
        _.forEach(this.BallPoolR.children, function(ball) {
            if (ball.opacity !== _opacityAll) {
                // 熄灭Ball
            }
        });
    },

    onBallBHandler: function(target) {
        target.currentTarget.opacity = target.currentTarget.opacity === _opacityNone ? _opacityHalf : _opacityNone;
    },

    onBallRHandler: function(target) {
        target.currentTarget.opacity = target.currentTarget.opacity === _opacityNone ? _opacityHalf : _opacityNone;
    },

    // 重置
    onResetHandler: function() {
        this.initData();
        this.initUI();
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
        this.resetRestBall();

        let tmp_DataSourceB = this.__DataSourceB;
        let resultB = [];
        for (var i = 0; i < 5; i++) {
            if (tmp_DataSourceB.length <= 1) break;
            var index = _.random(1, tmp_DataSourceB.length - 1);
            resultB[i] = tmp_DataSourceB[index];
            _.remove(tmp_DataSourceB, function(num) { return num === resultB[i]; });
        }
        if (resultB.length < 5) return;

        let tmp_DataSourceR = this.__DataSourceR;
        let resultR = [];
        for (var i = 0; i < 2; i++) {
            if (tmp_DataSourceR.length <= 1) break;
            var index = _.random(1, tmp_DataSourceR.length - 1);
            resultR[i] = tmp_DataSourceR[index];
            _.remove(tmp_DataSourceR, function(num) { return num === resultR[i]; });
        }
        if (resultR.length < 2) return;

        _.forEach(this.BallPoolB.children, function(ball) {
            if (_.find(tmp_DataSourceB, function(data) { return Number(ball.getChildByName('lb').getComponent(cc.Label).string) === data; })) {
                ball.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes('image/basketball', cc.SpriteFrame);
                // cc.loader.loadRes('image/basketball', cc.SpriteFrame, function(err, texture) {
                //     if (err) {
                //         log.e(err);
                //     } else {
                //         ball.getComponent(cc.Sprite).spriteFrame = texture;
                //     }
                // });
            }
        });
        _.forEach(this.BallPoolR.children, function(ball) {
            if (_.find(tmp_DataSourceR, function(data) { return Number(ball.getChildByName('lb').getComponent(cc.Label).string) === data; })) {
                ball.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes('image/basketball', cc.SpriteFrame);
            }
        });
    },

    onCloseHandler: function() {
        this.node.runAction(
            cc.sequence(
                cc.moveTo(0.2, cc.p(cc.director.getVisibleSize().width, 0)),
                cc.callFunc(function() {
                    this.node.removeFromParent();
                }, this)
            )
        );
    },
});