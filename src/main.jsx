import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './MainView';
import ZodiacStrip from './ZodiacStrip';
import { RangeStepInput } from 'react-range-step-input';
import { forceNumber, radToDeg, degToRad } from './utils';
import { maxHeaderSize } from 'http';

class PlanetaryConfigSim extends React.Component {
    constructor(props) {
	super(props);
	this.initialState = {
            targetFixed: true,
            observerPlanetAngle: 0,
            targetPlanetAngle: 0,
            radiusObserverPlanet: 1.00,
            radiusTargetPlanet: 2.40,
            radiusPixelObserver: 166.66,
            radiusPixelTarget: 400,
            observerMultiplier: Math.pow(1.0, -1.5),
            targetMultiplier:  Math.pow(2.4, -1.5),
            animationRate: 1.5,
            targetAngle: 0,
            sunAngle: -Math.PI,
            optionObserver: 0,
            optionTarget: 0,
            observerName: 'observer planet',
            targetName: 'target planet',
            holdObserver: 1.00,
            holdTarget: 2.40,
	};

	this.state = this.initialState;
	this.raf = null;

	this.stopAnimation = this.stopAnimation.bind(this);
    }

    render() {
        let startBtnText = 'start animation';
        if (this.state.isPlaying) {
            startBtnText = 'stop animation';
        }

        return <React.Fragment>
                    <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-between">
                      <span className="navbar-brand mb-0 h1">Planetary Configurations Simulator</span>

                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <a className="nav-link" href="#" onClick={this.onResetClick.bind(this)}>Reset</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#" data-toggle="modal" data-target="#helpModal">Help</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#" data-toggle="modal" data-target="#aboutModal">About</a>
                        </li>
                      </ul>
                    </nav>
                    <div className="row mt-2">
                      <div className="col-8">
                        <MainView
                          targetPlanetAngle={this.state.targetPlanetAngle}
                          observerPlanetAngle={this.state.observerPlanetAngle}
                          radiusTargetPlanet={this.state.radiusPixelTarget}
                          radiusObserverPlanet={this.state.radiusPixelObserver}
                          onTargetPlanetAngleUpdate={this.onTargetPlanetAngleUpdate.bind(this)}
                          onObserverPlanetAngleUpdate={this.onObserverPlanetAngleUpdate.bind(this)}
                          stopAnimation={this.stopAnimation}
                          targetAngle={this.state.targetAngle}
                          sunAngle={this.state.sunAngle}
                          targetName={this.state.targetName}
                          observerName={this.state.observerName}
                        />
                      </div>
                      <div className="rowx">
                        <div className="col">
                          <h4>Orbit Sizes</h4>
                          <div className="observerText">
                            <label htmlFor="radObserverPlanetRange">radius of observer planet's orbit:</label>
                          </div>
                          <div className="observerInput">
                            <form onSubmit={this.onSubmitObserver.bind(this)}>
                              <input
                                className="input"
                                type="number"
                                min={0.25}
                                max={10.00}
                                step={0.01}
                                value={this.state.holdObserver}
                                onChange={this.changeValObserver.bind(this)}
                              />
                            </form>
                          </div>
                          {/*
                             <input
                             type="number" size="10"
                             className="form-control form-control-sm"
                             step="10" name="distance"
                             min={50} max={600}
                             value={this.state.radiusObserverPlanet}
                             onChange={this.onObserverPlanetRadiusChange.bind(this)}
                             />
                           */}
                          <div className="observerSlider">
                            <input
                              type="range"
                              min={0.25}
                              max={10.00}
                              step={0.01}
                              value={this.state.radiusObserverPlanet}
                              onChange={this.onObserverPlanetRadiusChange.bind(this)}
                            />
                          </div>
                          {/*
                             <RangeStepInput
                             name="radiusObserverPlanet"
                             className="form-control-range ml-2"
                             value={this.state.radiusObserverPlanet}
                             onChange={this.onObserverPlanetRadiusChange.bind(this)}
                             step={0.1}
                             min={50} max={600}
                             />
                           */}
                          <div className="observerPresets">
                            <select className="form-control form-control-sm"
                                    onChange={this.onPresetSelectObserver.bind(this)}
                                    value={this.state.optionObserver}>
                              <option value={0} defaultValue>*preset*</option>
                              <option value={1}>Mercury</option>
                              <option value={2}>Venus</option>
                              <option value={3}>Earth</option>
                              <option value={4}>Mars</option>
                              <option value={5}>Jupiter</option>
                              <option value={6}>Saturn</option>
                            </select>
                          </div>
                          {/*</form>*/}

                          <div className="targetText">
                            <label htmlFor="radTargetPlanetRange">radius of target planet's orbit:</label>
                          </div>
                          <div className="targetInput">
                            <form onSubmit={this.onSubmitTarget.bind(this)}>
                              <input
                                className="input"
                                type="number"
                                min={0.25}
                                max={10.00}
                                step={0.01}
                                value={this.state.holdTarget}
                                onChange={this.changeValTarget.bind(this)}
                              />
                            </form>
                          </div>
                          {/*
                             <input
                             type="number" size="4"
                             className="form-control form-control-sm"
                             step="10" name="distance"
                             min={50} max={600}
                             value={this.state.radiusTargetPlanet}
                             onChange={this.onTargetPlanetRadiusChange.bind(this)}
                             />
                           */}
                          <div className="targetSlider">
                            <input
                              type="range"
                              min={0.25}
                              max={10.00}
                              step={0.01}
                              value={this.state.radiusTargetPlanet}
                              onChange={this.onTargetPlanetRadiusChange.bind(this)}
                            />
                          </div>
                          {/*
                             <RangeStepInput name="radiusTargetPlanet"
                             className="form-control-range ml-2"
                             value={this.state.radiusTargetPlanet}
                             onChange={this.onTargetPlanetRadiusChange.bind(this)}
                             step={0.1} min={50} max={600}
                             />
                           */}
                          <div className="targetPresets">
                            <select className="form-control form-control-sm"
                                    onChange={this.onPresetSelectTarget.bind(this)}
                                    value={this.state.optionTarget}>
                              <option value={0} defaultValue>*preset*</option>
                              <option value={1}>Mercury</option>
                              <option value={2}>Venus</option>
                              <option value={3}>Earth</option>
                              <option value={4}>Mars</option>
                              <option value={5}>Jupiter</option>
                              <option value={6}>Saturn</option>
                            </select>
                          </div>
                          {/*</form>*/}

                          {/*
                             <div className="presets">
                             <form>
                             <select className="form-control form-control-sm" onChange={this.onPresetSelect}>
                             <option value={-1}>Earth</option>
                             <option value={1}>Mercury</option>
                             <option value={2}>Venus</option>
                             </select>
                             </form>
                             </div>
                           */}
                        </div>

                        <div className="col">
                          <h4>Animation Control</h4>
                          <div className="animationText">
                            <label htmlFor="diamRange">speed:</label>
                          </div>
                          <div className="animationSlider">
                            <input
                              type="range"
                              step={0.1}
                              min={0.1}
                              max={Math.PI}
                              value={this.state.animationRate}
                              onChange={this.onAnimationRateChange.bind(this)}
                            />
                          </div>
                          <div className="animationButton">
                            <button type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={this.onStartClick.bind(this)}>
                              {startBtnText}
                            </button>
                          </div>
                          {/*
                             <RangeStepInput
                             name="animationRate"
                             className="form-control-range ml-2"
                             value={this.state.animationRate}
                             onChange={this.onAnimationRateChange.bind(this)}
                             step={0.1}
                             min={0.1} max={3}
                             />
                           */}
                        </div>

                        <div className="toggleFeatures">
                          <input type="checkbox"
                           name="elongationDisplay"
                           /* onChange={this.props.onInputChange} */
                           /* checked={this.props.showDeclinationCircle} */
                           id="elongToggle" />
                          <label htmlFor="elongationDisplay">
                            Show the sun&apos;s declination circle
                          </label>
                        </div>

                      </div>
		      <div className="bot">
		        <ZodiacStrip
                          speed={this.state.animationRate}
                          observerPlanetAngle={this.state.observerPlanetAngle}
                          targetPlanetAngle={this.state.targetPlanetAngle}
                          radiusObserverPlanet={this.state.radiusPixelObserver}
                          radiusTargetPlanet={this.state.radiusPixelTarget}
                          isPlaying={this.state.isPlaying}
                          stopAnimation={this.stopAnimation}
                          updateAngles={this.updateAngles.bind(this)}
		        />
                      </div>
                    </div>
                  </React.Fragment>;
    }

    incrementObserverPlanetAngle(n, inc) {
        const newAngle = n + (this.state.observerMultiplier * inc);
        if (newAngle > Math.PI) {
            return newAngle * -1;
        }
        return newAngle;
    }

    incrementTargetPlanetAngle(n, inc) {
        const newAngle = n + (this.state.targetMultiplier * inc);
        if (newAngle > Math.PI) {
            return newAngle * -1;
        }
        return newAngle;
    }

    animate() {
        const me = this;
        this.updateMultiplier();
        this.setState(prevState => ({
            observerPlanetAngle: me.incrementObserverPlanetAngle(prevState.observerPlanetAngle, 0.0115 * this.state.animationRate),
            targetPlanetAngle: me.incrementTargetPlanetAngle(prevState.targetPlanetAngle, 0.0115 * this.state.animationRate)
        }));

        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    onStartClick() {
        if (!this.state.isPlaying) {
            this.raf = requestAnimationFrame(this.animate.bind(this));
            this.setState({isPlaying: true});
        } else {
            this.stopAnimation();
            this.setState({isPlaying: false});
        }
    }

    updateAngles(targetAng, sunAng) {
        this.setState({
            targetAngle: targetAng,
            sunAngle: sunAng,
        });
    }

    updateMultiplier() {
        let newObserver = Math.pow(this.state.radiusObserverPlanet, -1.5);
        let newTarget = Math.pow(this.state.radiusTargetPlanet, -1.5);

        this.setState({
            targetMultiplier: newTarget,
            observerMultiplier: newObserver,
        });
    }

    onObserverPlanetAngleUpdate(newAngle) {
        this.stopAnimation();
        let diff = 0;
        let newAng = newAngle;
        let prevObserverPlanetAng = this.state.observerPlanetAngle;

        if (newAng >= (Math.PI / 2) && newAng <= Math.PI && prevObserverPlanetAng >= -Math.PI
            && prevObserverPlanetAng <= (-Math.PI / 2)) {
            diff = -(Math.abs(newAng - Math.PI) + Math.abs(-Math.PI - prevObserverPlanetAng));
        } else if (prevObserverPlanetAng >= (Math.PI / 2) && prevObserverPlanetAng <= Math.PI
                   && newAng >= -Math.PI && newAng <= (-Math.PI / 2)) {
            diff = (Math.abs(prevObserverPlanetAng - Math.PI) + Math.abs(-Math.PI - newAng));
        } else {
            diff = newAng - this.state.observerPlanetAngle;
        }

        this.updateMultiplier();
        diff *= this.state.targetMultiplier / this.state.observerMultiplier;
        let newTargetPlanet = (this.state.targetPlanetAngle + diff);
        if (newTargetPlanet >= Math.PI) {
            newTargetPlanet = -Math.PI;
        } else if (newTargetPlanet <= -Math.PI) {
            newTargetPlanet = Math.PI;
        }

        this.setState({
            isPlaying: false,
            observerPlanetAngle: newAngle,
            targetPlanetAngle: newTargetPlanet
        });
    }

    onTargetPlanetAngleUpdate(newAngle) {
        this.stopAnimation();
        let diff = 0;
        let newAng = newAngle;
        let prevObserverPlanetAng = this.state.targetPlanetAngle;

        if (newAng >= (Math.PI / 2) && newAng <= Math.PI && prevObserverPlanetAng >= -Math.PI
            && prevObserverPlanetAng <= (-Math.PI / 2)) {
            diff = -(Math.abs(newAng - Math.PI) + Math.abs(-Math.PI - prevObserverPlanetAng));
        } else if (prevObserverPlanetAng >= (Math.PI / 2) && prevObserverPlanetAng <= Math.PI
                   && newAng >= -Math.PI && newAng <= (-Math.PI / 2)) {
            diff = (Math.abs(prevObserverPlanetAng - Math.PI) + Math.abs(-Math.PI - newAng));
        } else {
            diff = newAng - this.state.targetPlanetAngle;
        }

        this.updateMultiplier();
        diff *= this.state.observerMultiplier / this.state.targetMultiplier;
        let newObserverPlanet = (this.state.observerPlanetAngle + diff);
        if (newObserverPlanet >= Math.PI) {
            newObserverPlanet = -Math.PI;
        } else if (newObserverPlanet <= -Math.PI) {
            newObserverPlanet = Math.PI;
        }

        this.setState({
            isPlaying: false,
            targetPlanetAngle: newAngle,
            observerPlanetAngle: newObserverPlanet
        });
    }

    onAnimationRateChange(e) {
        this.setState({
            animationRate: forceNumber(e.target.value)
        });
    }

    onPresetSelectObserver(e) {
        this.setState({
            optionObserver: e.target.value
        });

        if (e.target.value == 0) {
            this.onObserverPlanetRadiusChange(1.00);
            name = "observer planet";
        } else if (e.target.value == 1) {
            this.onObserverPlanetRadiusChange(0.39);
            name = "observer (mercury)";
        } else if (e.target.value == 2) {
            this.onObserverPlanetRadiusChange(0.72);
            name = "observer (venus)";
        } else if (e.target.value == 3) {
            this.onObserverPlanetRadiusChange(1.00);
            name = "observer (earth)";
        } else if (e.target.value == 4) {
            this.onObserverPlanetRadiusChange(1.52);
            name = "observer (mars)";
        } else if (e.target.value == 5) {
            this.onObserverPlanetRadiusChange(5.20);
            name = "observer (jupiter)";
        } else if (e.target.value == 6) {
            this.onObserverPlanetRadiusChange(9.54);
            name = "observer (saturn)";
        }

        this.setState({
            observerName: name,
        });

    }

    onPresetSelectTarget(e) {
        this.setState({
            optionTarget: e.target.value,
        });

        let name = "";

        if (e.target.value == 0) {
            this.onTargetPlanetRadiusChange(2.40);
            name = "target planet";
        } else if (e.target.value == 1) {
            this.onTargetPlanetRadiusChange(0.39);
            name = "target (mercury)";
        } else if (e.target.value == 2) {
            this.onTargetPlanetRadiusChange(0.72);
            name = "target (venus)";
        } else if (e.target.value == 3) {
            this.onTargetPlanetRadiusChange(1.00);
            name = "target (earth)";
        } else if (e.target.value == 4) {
            this.onTargetPlanetRadiusChange(1.52);
            name = "target (mars)";
        } else if (e.target.value == 5) {
            this.onTargetPlanetRadiusChange(5.20);
            name = "target (jupiter)";
        } else if (e.target.value == 6) {
            this.onTargetPlanetRadiusChange(9.54);
            name = "target (saturn)";
        }

        this.setState({
            targetName: name,
        });
    }

    onObserverPlanetRadiusChange(e) {
        let au = 0;

        if (typeof(e) === 'object') {
    	    au = e.target.value;
            this.setState({
                observerName: "observer planet",
                holdObserver: au,
            });
        } else {
            au = e;
            this.setState({
                holdObserver: au,
            });
        }

        if (au >= this.state.radiusTargetPlanet) {
            this.changeTarget(au);
        } else {
            let ratio = (au / this.state.radiusTargetPlanet) * 400;
            this.setState({
                radiusPixelObserver: forceNumber(ratio),
                radiusObserverPlanet: forceNumber(au),
                radiusPixelTarget: 400,
            });
        }

        this.updateMultiplier();
    }

    changeObserver(au) {
        let ratio = (this.state.radiusObserverPlanet / au) * 400;

        this.setState({
            radiusTargetPlanet: forceNumber(au),
            radiusPixelObserver: forceNumber(ratio),
            radiusPixelTarget: 400,
        });
    }

    onTargetPlanetRadiusChange(e) {
        let au = 0;

        if (typeof(e) === 'object') {
    	    au = e.target.value;
            this.setState({
                targetName: "target planet",
                holdTarget: au,
            });
        } else {
            au = e;
            this.setState({
                holdTarget: au,
            });
        }

        if (au >= this.state.radiusObserverPlanet) {
            this.changeObserver(au);
        } else {
            let ratio = (au / this.state.radiusObserverPlanet) * 400;
            this.setState({
            	radiusPixelTarget: forceNumber(ratio),
                radiusTargetPlanet: forceNumber(au),
                radiusPixelObserver: 400,
            });
        }

        this.updateMultiplier();
    }

    changeTarget(au) {
        let ratio = (this.state.radiusTargetPlanet / au) * 400;

        this.setState({
            radiusObserverPlanet: forceNumber(au),
            radiusPixelTarget: forceNumber(ratio),
            radiusPixelObserver: 400,
        });
    }

    stopAnimation() {
        cancelAnimationFrame(this.raf);
    }

    onResetClick(e) {
        e.preventDefault();
        this.stopAnimation();
        this.setState(this.initialState);
    }

    onSubmitObserver(e) {
        e.preventDefault();
        this.onObserverPlanetRadiusChange(this.state.holdObserver);
    }

    onSubmitTarget(e) {
        e.preventDefault();
        this.onTargetPlanetRadiusChange(this.state.holdTarget);
    }

    changeValObserver(e) {
        this.setState({holdObserver: e.target.value});
    }

    changeValTarget(e) {
        this.setState({holdTarget: e.target.value});
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<PlanetaryConfigSim />, domContainer);
