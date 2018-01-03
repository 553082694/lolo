cc.Class({
    extends: cc.Component,

    properties: {
        Prompt: cc.Node,
        LockPrompt: cc.Node,

        __Password: 0,
        __ClearCachKey: 0
    },

    onLoad: function() {
        this.__Password = 0;
        this.__ClearCachKey = 0;
    },

    start: function() {
        this.Prompt.opacity = 0;
        this.checkLocked();
    },

    onNumHandler: function(target, num) {
        this.__Password = this.__Password * 10 + Number(num);
        if ((this.__Password + '').length === 6) {
            this.onAuthentication();
            this.__Password = 0;
        }
    },

    onAuthentication: function() {
        if (require('md5')(this.__Password + '') === 'bc950b54b52ca7f9221fcce492b26a43') {
            this.SetLocked(0);
            cc.director.loadScene('main');
        } else {
            this.SetLocked(this.GetLocked() + 1);
            this.Prompt.getComponent(cc.Label).string = '验证失败：' + this.GetLocked();
            this.Prompt.opacity = 255;
            this.Prompt.runAction(
                cc.sequence(
                    cc.delayTime(1),
                    cc.fadeOut(0.5)
                )
            );
        }

        this.checkLocked();
    },

    checkLocked: function() {
        if (this.GetLocked() >= 3)
            this.LockPrompt.active = true;
        else
            this.LockPrompt.active = false;
    },

    onUnlockNumHandler: function(target, num) {
        this.__ClearCachKey = this.__ClearCachKey * 10 + Number(num);
    },

    onCheckUnlockKeyHandler: function() {
        if (require('md5')(this.__ClearCachKey + '') === 'efa82aa268cca1877cf6f59cf3606032') {
            this.SetLocked(0);
            this.LockPrompt.active = false;
        }
        this.__ClearCachKey = 0;
    },

    GetLocked: function() { return Number(cc.sys.localStorage.getItem('TryTimes') || 0); },
    SetLocked: function(value) { cc.sys.localStorage.setItem('TryTimes', value + ''); }
});