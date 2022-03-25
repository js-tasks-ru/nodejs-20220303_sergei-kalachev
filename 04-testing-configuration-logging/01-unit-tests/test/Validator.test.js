const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('validates all the fields for min and max', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: '', age: 1});
      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 3, got 0');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too little, expect 10, got 1');
    });

    it('validates all the fields for the correct type', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 1, age: ''});
      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('gives 0 errors for empty object', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({});
      expect(errors).to.have.length(0);
    });

    it('ignores the field if it does not have a rule decribed', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 20,
        },
      });

      const errors = validator.validate({age: 18});
      expect(errors).to.have.length(0);
    });

    describe('string', () => {
      it('check fields for min', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('checks fields for max', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalalalalalalalalallalalalalalalalalalal'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 40');
      });

      it('checks the value corresponds to the declared type', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
            max: 20,
          },
        });

        const errors = validator.validate({name: 15});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });

      it('gives no errors for correct values', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 3,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Anton'});
        expect(errors).to.have.length(0);
      });
    });

    describe('numeric', () => {
      it('checks fields for min', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 99,
          },
        });

        const errors = validator.validate({age: 16});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.equal('age');
        expect(errors[0]).to.have.property('error').and.to.equal('too little, expect 18, got 16');
      });

      it('checks fields for max', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 99,
          },
        });

        const errors = validator.validate({age: 101});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 18, got 101');
      });

      it('checks the value corresponds to the declared type', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 99,
          },
        });

        const errors = validator.validate({age: 'a hundred'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });

      it('gives no errors for correct values', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 3,
            max: 20,
          },
        });

        const errors = validator.validate({age: 5});
        expect(errors).to.have.length(0);
      });
    });
  });
});
