class ErrorModel {
    constructor(code, message, data = null) {
      this.code = code;
      this.message = message; 
      if (data) {
        this.data = data; 
      }
    }
  }
  
  module.exports = ErrorModel;