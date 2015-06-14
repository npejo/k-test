describe('MainContainerView', function() {
    describe('Test `addEventListeners` method', function() {
        before(function() {
            this.appContainer = document.getElementById('app-container');
            this.appEventsSpy = sinon.spy(FluidL.Models.EventsModel.prototype, 'subscribe');
            this.handleBOverStub = sinon.stub(FluidL.Views.MainContainerView.prototype, 'handleBoxOver');
            this.handleBOutStub = sinon.stub(FluidL.Views.MainContainerView.prototype, 'handleBoxOut');
            this.appEvents = new FluidL.Models.EventsModel();
        });

        after(function() {
            this.appEventsSpy.restore();
            this.handleBOverStub.restore();
            this.handleBOutStub.restore();
            this.appContainer = null;
        });

        it('should register to `box-over` and `box-out` events', function() {
            var mcView = new FluidL.Views.MainContainerView({
                element: this.appContainer,
                appEvents: this.appEvents
            });
            mcView.addEventListeners();

            expect(this.appEventsSpy).to.be.calledTwice;
            expect(this.appEventsSpy).to.be.calledWith('box-over');
            expect(this.appEventsSpy).to.be.calledWith('box-out');
        });

        it('should invoke proper handler when `box-over` method is published', function() {
            this.appEvents.publish('box-over');
            expect(this.handleBOverStub).to.be.calledOnce;
        });

        it('should invoke proper handler when `box-out` method is published', function() {
            this.appEvents.publish('box-out');
            expect(this.handleBOutStub).to.be.calledOnce;
        });
    });

    describe('Test `handleBoxOver` method', function() {
        before(function() {
            this.appContainer = document.getElementById('app-container');
            this.mcView = new FluidL.Views.MainContainerView({
                element: this.appContainer
            });
        });

        after(function() {
            this.appContainer.style.border = 'none';
            this.appContainer = null;
            this.mcView = null;
        });

        it('should add 10px border on box-over', function() {
            this.mcView.handleBoxOver();
            expect(this.appContainer.style.border).to.equal('10px solid black');
        });

        it('should have 1px border on box-out', function() {
            this.mcView.handleBoxOut();
            expect(this.appContainer.style.border).to.equal('1px solid black');
        });
    });
});