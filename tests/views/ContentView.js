describe('ContentView', function() {
    describe('Test `initialize` method', function() {
        beforeEach(function() {
            this.setBgColorStub = sinon.stub(FluidL.Views.ContentView.prototype, 'setBgColor');
            this.addListenersStub = sinon.stub(FluidL.Views.ContentView.prototype, 'addEventListeners');
            this.addBoxViewStub = sinon.stub(FluidL.Views.ContentView.prototype, 'addBoxView');
            this.getCurrentBoxesStub = sinon.stub(FluidL.Models.StateModel.prototype, 'getCurrentBoxes');
            this.getCurrentBoxesStub.returns([{id: '2'}, {id: '3'}, {id: '4'}]);
            this.initContentStub = sinon.stub(FluidL.Views.ContentView.prototype, 'initContent');


        });

        afterEach(function() {
            this.setBgColorStub.restore();
            this.addListenersStub.restore();
            this.addBoxViewStub.restore();
            this.getCurrentBoxesStub.restore();
            this.initContentStub.restore();
        });
        it('should draw already saved boxes', function() {
            var hasSavedStateStub = sinon.stub(FluidL.Models.StateModel.prototype, 'hasSavedState');
            hasSavedStateStub.returns(true);

            var appState = new FluidL.Models.StateModel();
            var cView = new FluidL.Views.ContentView({
                appState: appState
            });

            cView.initialize();

            expect(this.addBoxViewStub).to.be.callCount(3);
            expect(this.addBoxViewStub).to.be.calledWith({id: '2'});
            expect(this.addBoxViewStub).to.be.calledWith({id: '3'});
            expect(this.addBoxViewStub).to.be.calledWith({id: '4'});

            expect(this.setBgColorStub).to.be.calledWith(0);
            expect(this.addListenersStub).to.be.called;

            hasSavedStateStub.restore();
        });

        it('should init content if there is no saved state', function() {
            var hasSavedStateStub = sinon.stub(FluidL.Models.StateModel.prototype, 'hasSavedState');
            hasSavedStateStub.returns(false);

            var appState = new FluidL.Models.StateModel();
            var cView = new FluidL.Views.ContentView({
                appState: appState
            });

            cView.initialize();

            expect(this.initContentStub).to.be.called;
            expect(this.setBgColorStub).to.be.called;
            expect(this.addListenersStub).to.be.called;
            expect(this.initContentStub).to.be.called;
            expect(this.getCurrentBoxesStub).not.to.be.called;
            expect(this.addBoxViewStub).not.to.be.called;

            hasSavedStateStub.restore();
        });
    });

    describe('Test `handleRemoveBoxView` method', function() {
        beforeEach(function() {
            this.setBgColorStub = sinon.stub(FluidL.Views.ContentView.prototype, 'setBgColor');
            this.updateBoxesFromIndexStub = sinon.stub(FluidL.Views.ContentView.prototype, 'updateBoxesFromIndex');
            this.boxRemovedStub = sinon.stub(FluidL.Models.StateModel.prototype, 'boxRemoved');

            this.appState = new FluidL.Models.StateModel();
        });
        afterEach(function() {
            this.setBgColorStub.restore();
            this.updateBoxesFromIndexStub.restore();
            this.boxRemovedStub.restore();
        });

        it('should remove the box on specified `boxIndex` from `boxes` array', function() {
            var cView = new FluidL.Views.ContentView({
                element: '',
                appState: this.appState
            });
            cView.boxes = [{id: 1}, {id: 2}, {id: 3}];

            cView.handleRemoveBoxView({boxIndex: 2, boxId: 3});

            expect(this.updateBoxesFromIndexStub).to.be.calledWith(1);
            expect(this.setBgColorStub).to.be.calledWith(5);
            expect(this.boxRemovedStub).to.be.calledWith(3);
        });
    });

    describe('Test `initBoxView` method', function() {
        beforeEach(function() {
            this.calculateGridRowStub = sinon.stub(FluidL.Views.ContentView.prototype, 'calculateGridRow');
            this.calculateGridRowStub.returns(3);
            this.getPrevBoxIdStub = sinon.stub(FluidL.Views.ContentView.prototype, 'getPrevBoxId');
            this.getPrevBoxIdStub.returns(5);
            this.getNextBoxIdStub = sinon.stub(FluidL.Views.ContentView.prototype, 'getNextBoxId');
            this.getNextBoxIdStub.returns(6);
            this.boxInitStub = sinon.stub(FluidL.Views.BoxView.prototype, 'init');

            this.box = new FluidL.Views.BoxView({id: '3'});
            this.cView = new FluidL.Views.ContentView({
                element: ''
            });
        });
        afterEach(function() {
            this.calculateGridRowStub.restore();
            this.getPrevBoxIdStub.restore();
            this.getNextBoxIdStub.restore();
        });

        it('should calculate the row type for the box index and init the box view', function() {
            this.cView.initBoxView(this.box, 4, true);

            expect(this.calculateGridRowStub).to.be.calledOnce;
            expect(this.boxInitStub).to.be.calledTwice;

            expect(this.boxInitStub).to.be.calledWith({id: '3'});
            expect(this.boxInitStub).to.be.calledWith({
                index: 4,
                gridRow: 3,
                prevBox: 5,
                nextBox: 6,
                isLast: true

            });
        });
    });

    describe('Test `calculateGridRow` method', function() {
        it('should calculate the type of the row in the grid for specific box index', function() {
            var cView = new FluidL.Views.ContentView({
                element: ''
            });

            var gr = null;
            gr = cView.calculateGridRow(-5);
            expect(gr).to.equal(1);

            var results = [1,1,1,2,2,3,1,1,1,2,2,3,1,1,1,2,2,3,1,1,1];
            for (var index = 0; index < 21; index++) {
                gr = cView.calculateGridRow(index);
                expect(gr).to.equal(results[index]);
            }
        });
    });

    describe('Test `getPrevBoxId` method', function() {
        it('should return the id of the previous box in the same row and null if there isn\'t previous box', function() {
            var cView = new FluidL.Views.ContentView({
                element: ''
            });
            cView.boxes = [
                new FluidL.Views.BoxView({id: 3}),
                new FluidL.Views.BoxView({id: 5}),
                new FluidL.Views.BoxView({id: 7}),
                new FluidL.Views.BoxView({id: 9}),
                new FluidL.Views.BoxView({id: 11}),
                new FluidL.Views.BoxView({id: 13}),
                new FluidL.Views.BoxView({id: 15}),
                new FluidL.Views.BoxView({id: 17})
            ];

            var prevId = null;
            prevId = cView.getPrevBoxId(-4, 1);
            expect(prevId).to.equal(null);

            var results = [null, 3, 5, null, 9, null, null, 15];
            for (var i = 0; i < cView.boxes.length; i++) {
                var rowNum = cView.calculateGridRow(i);
                prevId = cView.getPrevBoxId(i, rowNum);
                expect(prevId).to.equal(results[i]);
            }
        });
    });

    describe('Test `getNextBoxId` method', function() {
        it('should return the id of the next box in the same row and null if there isn\'t next box', function() {
            var cView = new FluidL.Views.ContentView({
                element: ''
            });
            cView.boxes = [
                new FluidL.Views.BoxView({id: 3}),
                new FluidL.Views.BoxView({id: 5}),
                new FluidL.Views.BoxView({id: 7}),
                new FluidL.Views.BoxView({id: 9}),
                new FluidL.Views.BoxView({id: 11}),
                new FluidL.Views.BoxView({id: 13}),
                new FluidL.Views.BoxView({id: 15}),
                new FluidL.Views.BoxView({id: 17})
            ];

            var prevId = null;
            prevId = cView.getPrevBoxId(-4, 1);
            expect(prevId).to.equal(null);

            var results = [5, 7, null, 11, null, null, 17, null];
            for (var i = 0; i < cView.boxes.length; i++) {
                var rowNum = cView.calculateGridRow(i);
                prevId = cView.getNextBoxId(i, rowNum);
                expect(prevId).to.equal(results[i]);
            }
        });
    });
});