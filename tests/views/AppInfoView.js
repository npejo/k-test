describe('AppInfoView', function() {
    describe('Test `constructor`', function() {
        before(function() {
            this.appContainer = document.getElementById('app-container');

            function appStateDummy() {}
            this.appSD = new appStateDummy();

            this.appInfoView = new FluidL.Views.AppInfoView({
                element: this.appContainer,
                appState: this.appSD
            });
        });

        after(function() {
            this.appContainer.innerHTML = '';
            this.appSD = null;
            this.appInfoView = null;
        });

        it('should initialize `msgTimeout` property', function() {
            expect(this.appInfoView.msgTimeout).to.equal(null);
        });

        it('should set `appState` property with input object', function() {
            expect(this.appInfoView.appState).to.equal(this.appSD);
        });
    });

    describe('Test `addEventListeners` method', function() {
        before(function() {
            this.appContainer = document.getElementById('app-container');
            var resetBtn = document.createElement('button');
            resetBtn.className = 'js-reset';
            this.appContainer.appendChild(resetBtn);

            this.appEventsSpy = sinon.spy(FluidL.Models.EventsModel.prototype, 'subscribe');
            this.resetSpy = sinon.spy(FluidL.Views.AppInfoView.prototype, 'addListener');
            this.handleBAddedStub = sinon.stub(FluidL.Views.AppInfoView.prototype, 'handleBoxAdded');
            this.handleBRemovedStub = sinon.stub(FluidL.Views.AppInfoView.prototype, 'handleBoxRemoved');
            this.handleResetStub = sinon.stub(FluidL.Views.AppInfoView.prototype, 'handleResetContent');
            this.appEvents = new FluidL.Models.EventsModel();
        });

        after(function() {
            this.appEventsSpy.restore();
            this.appEvents = null;
            this.resetSpy.restore();
            this.handleBAddedStub.restore();
            this.handleBRemovedStub.restore();
            this.handleResetStub.restore();
            this.appContainer.innerHTML = '';
            this.appContainer = null;
        });

        it('should register to `box-added` and `box-removed` events', function() {
            var aiView = new FluidL.Views.AppInfoView({
                element: this.appContainer,
                appEvents: this.appEvents
            });
            aiView.addEventListeners();

            expect(this.appEventsSpy).to.be.calledTwice;
            expect(this.appEventsSpy).to.be.calledWith('box-added');
            expect(this.appEventsSpy).to.be.calledWith('box-removed');
        });

        it('should add `click` event listener for content reset', function() {
            expect(this.resetSpy).to.be.calledOnce;
            expect(this.resetSpy).to.be.calledWith('.js-reset');
        });

        it('should invoke proper handler when `box-added` method is published', function() {
            this.appEvents.publish('box-added');
            expect(this.handleBAddedStub).to.be.calledOnce;
        });

        it('should invoke proper handler when `box-removed` method is published', function() {
            this.appEvents.publish('box-removed');
            expect(this.handleBRemovedStub).to.be.calledOnce;
        });

        it('should invoke proper handler when reset button is clicked', function() {
            this.appContainer.querySelectorAll('.js-reset')[0].click();
            expect(this.handleResetStub).to.be.calledOnce;
        });
    });

    describe('Test `handleBoxAdded` method', function() {
        beforeEach(function() {
            this.appStateStub = sinon.stub(FluidL.Models.StateModel.prototype, 'getCurrentBoxes');
            this.appStateStub.returns([
                {id: '11'}, {id: '22'}, {id: '33'}
            ]);

            this.showCsStub = sinon.stub(FluidL.Views.AppInfoView.prototype, 'showCurrentStats');
            this.showMessageStub = sinon.stub(FluidL.Views.AppInfoView.prototype, 'showMessage');

            this.appState = new FluidL.Models.StateModel();
            this.appInfoView = new FluidL.Views.AppInfoView({
                element: '',
                appState: this.appState
            });
        });

        afterEach(function() {
            this.showCsStub.restore();
            this.showMessageStub.restore();
            this.appStateStub.restore();
            this.appState = null;
            this.appInfoView = null;
        });

        it('should invoke `showCurrentState` method', function() {
            this.appInfoView.handleBoxAdded(0);
            expect(this.showCsStub).to.be.calledOnce;
        });

        it('should invoke `showMessage` method', function() {
            this.appInfoView.handleBoxAdded(1);
            expect(this.showMessageStub).to.be.calledWith('Box [22] added on position 2');

            this.appInfoView.handleBoxAdded(2);
            expect(this.showMessageStub).to.be.calledWith('Box [33] added on position 3');

            expect(this.showMessageStub).to.be.calledTwice;
        });
    });

    describe('Test `showMessage` method' ,function() {
        before(function() {
            this.appContainer = document.getElementById('app-container');
            this.infoMsg = document.createElement('div');
            this.infoMsg.id = 'actions-info-msg';
            this.appContainer.appendChild(this.infoMsg);

            this.appInfoView = new FluidL.Views.AppInfoView({
                element: this.appContainer
            });

            this.clock = sinon.useFakeTimers();
        });

        after(function() {
            this.appContainer.innerHTML = '';
            this.appContainer = null;
        });

        it('should display message, set timeout', function() {
            this.appInfoView.showMessage('Test message');

            expect(this.appInfoView.msgTimeout).to.not.be.equal(null);
            expect(this.infoMsg.innerHTML).to.equal('Test message');
        });

        it('should hide message after timeout', function() {
            this.clock.tick(3001);
            expect(this.infoMsg.innerHTML).to.equal('');
        });
    });
});