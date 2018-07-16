//@@../utils/Utils.js
//@@../WebGLUtils.js

(function(global) {
'use strict';

var Class = global.AbstractToneMapper = AbstractToneMapper;
var _ = Class.prototype;

// ========================== CLASS DECLARATION ============================ //

function AbstractToneMapper(gl, texture, options) {
    CommonUtils.extend(this, Class.defaults, options);

    this._gl = gl;
    this._texture = texture;

    _._init.call(this);
};

Class.defaults = {
    _bufferSize : 512
};

// ======================= CONSTRUCTOR & DESTRUCTOR ======================== //

_._nullify = function() {
    this._renderBuffer    = null;
    this._clipQuad        = null;
    this._clipQuadProgram = null;
};

_._init = function() {
    _._nullify.call(this);

    var gl = this._gl;
    this._renderBuffer = new SingleBuffer(gl, this._getRenderBufferOptions());

    this._clipQuad = WebGLUtils.createClipQuad(gl);
    this._clipQuadProgram = WebGLUtils.compileShaders(gl, {
        quad: SHADERS.quad
    }).quad;
};

_.destroy = function() {
    this._renderBuffer.destroy();
    gl.deleteBuffer(this._clipQuad);
    gl.deleteProgram(this._clipQuadProgram.program);

    _._nullify.call(this);
};

// =========================== INSTANCE METHODS ============================ //

_.render = function() {
    // TODO: put the following logic in VAO
    var gl = this._gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._clipQuad);
    gl.enableVertexAttribArray(0); // position always bound to attribute 0
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this._renderBuffer.use();
    this._renderFrame();
};

_.setTexture = function(texture) {
    this._texture = texture;
};

_.getTexture = function() {
    return this._renderBuffer.getTexture();
};

_._renderFrame = function() {
    throw CommonUtils.noimpl;
};

_._getRenderBufferOptions = function() {
    var gl = this._gl;
    return {
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.LINEAR,
        mag            : gl.LINEAR,
        wrapS          : gl.CLAMP_TO_EDGE,
        wrapT          : gl.CLAMP_TO_EDGE,
        format         : gl.RGBA,
        internalFormat : gl.RGBA,
        type           : gl.UNSIGNED_BYTE
    };
};

// ============================ STATIC METHODS ============================= //

})(this);
