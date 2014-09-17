describe('blocks.exception', function() {
    var exceptionHandlerProvider;
    var mocks = {
        errorMessage: 'fake error',
        prefix: '[TEST]: '
    };

    beforeEach(function() {
        module('blocks.exception', function($provide, _exceptionHandlerProvider_) {
            exceptionHandlerProvider = _exceptionHandlerProvider_;
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($rootScope) {});
    });

    describe('$exceptionHandler', function() {
        it('should have a dummy test', inject(function() {
            expect(true).to.equal(true);
        }));

        it('should be defined', inject(function($exceptionHandler) {
            expect($exceptionHandler).to.be.defined;
        }));

        it('should have configuration', inject(function($exceptionHandler) {
            expect($exceptionHandler.config).to.be.defined;
        }));

        describe('with appErrorPrefix', function() {
            beforeEach(function() {
                exceptionHandlerProvider.configure(mocks.prefix);
            });

            it('should have exceptionHandlerProvider defined', inject(function() {
                expect(exceptionHandlerProvider).to.be.defined;
            }));

            it('should have exceptionHandlerProvider\'s appErrorPrefix defined', inject(function() {
                expect(exceptionHandlerProvider.$get().config.appErrorPrefix).to.be.defined;
            }));

            it('should have exceptionHandlerProvider\'s appErrorPrefix set properly', inject(function() {
                expect(exceptionHandlerProvider.$get().config.appErrorPrefix).to.equal(mocks.prefix);
            }));

            it('should throw an error when forced', inject(function() {
                expect(functionThatWillThrow).to.throw();

                function functionThatWillThrow() {
                    throw new Error(mocks.errorMessage);
                }
            }));

            it.skip('manual error is handled by decorator', function(exceptionHandler) {
                var exception;
                exceptionHandlerProvider.configure(mocks.prefix);
                try {
                    $rootScope.$apply(function() {
                        throw new Error(mocks.errorMessage);
                    });
                }
                catch (ex) {
                    exception = ex;
                    expect(ex.message).to.equal(mocks.prefix + mocks.errorMessage);
                }
                // console.log(exception.message);
                expect(exception.message).to.equal(mocks.prefix + mocks.errorMessage);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});