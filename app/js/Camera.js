//@@math/Matrix.js
//@@math/Vector.js
//@@math/Quaternion.js

(function (global) {
    'use strict';

    var Class = global.Camera = Camera;
    var _ = Class.prototype;

    // ========================== CLASS DECLARATION ============================ //

    function Camera(options) {
        CommonUtils.extend(this, Class.defaults, options);

        _._init.call(this);
    };

    Class.defaults = {
        fovX: 1,
        fovY: 1,
        near: 0.1,
        far: 5,
        zoomFactor: 0.001,
        width: 0,
        height : 0
    };

    // ======================= CONSTRUCTOR & DESTRUCTOR ======================== //

    _._nullify = function () {
        this.position = null;
        this.rotation = null;
        this.viewMatrix = null;
        this.projectionMatrix = null;
        this.transformationMatrix = null;
        this.isDirty = null;
    };

    _._init = function () {
        _._nullify.call(this);

        this.position = new Vector();
        this.rotation = new Quaternion();
        this.viewMatrix = new Matrix([-0.0015707561979070306, -0.0011902183759957552, -0.9999980926513672, 0, 0.00000000007192543782785776, 0.9999992847442627, -0.001190219889394939, 0, 0.9999988079071045, -0.0000018695916423894232, -0.0015707551501691341, 0, 0.00000006631738358464645, -0.00000000013147689881254365, -1.679560899734497, 1]).transpose();
        this.projectionMatrix = new Matrix();
        this.transformationMatrix = new Matrix();
        this.isDirty = false;
    };

    _.destroy = function () {
        _._nullify.call(this);
    };

    // =========================== INSTANCE METHODS ============================ //

    _.updateViewMatrix = function () {
        this.rotation.toRotationMatrix(this.viewMatrix.m);
        this.viewMatrix.m[3] = this.position.x;
        this.viewMatrix.m[7] = this.position.y;
        this.viewMatrix.m[11] = this.position.z;
        this.viewMatrix.inverse();
    };

    _.updateProjectionMatrix = function () {


        let top = 0.1 * Math.tan((Math.PI / 180) * 0.5 * 60),
            height = 2 * top,
            width = (this.width / this.height) * height,
            left = - 0.5 * width;           //width / height

        this.projectionMatrix.fromFrustum(left, left + width, top - height, top, 0.1, 2000);
    };

    _.updateMatrices = function () {
        //this.updateViewMatrix();
        this.updateProjectionMatrix();
        this.transformationMatrix.multiply(this.projectionMatrix, this.viewMatrix);
    };

    _.resize = function (width, height) {
        this.fovX = width * this.zoomFactor;
        this.fovY = height * this.zoomFactor;
        this.width = width;
        this.height = height;
        this.isDirty = true;
    };

    _.zoom = function (amount) {
        var scale = Math.exp(amount);
        this.zoomFactor *= scale;
        this.fovX *= scale;
        this.fovY *= scale;
        this.isDirty = true;
    };

    // ============================ STATIC METHODS ============================= //

})(this);
