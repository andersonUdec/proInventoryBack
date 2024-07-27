class SuccessModel {
    constructor(code = 200, message = 'Operación exitosa', data) {
      this.code = code;
      this.message = message;
      if (data) {
        this.data = data;
      }
    }
  }
  
  module.exports = SuccessModel;