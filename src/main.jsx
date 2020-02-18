import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './MainView';
import ZodiacStrip from './ZodiacStrip';
import {RangeStepInput} from 'react-range-step-input';
import {forceNumber, radToDeg, degToRad} from './utils';
import { maxHeaderSize } from 'http';

class PlanetaryConfigSim extends React.Component {
    constructor(props) {
	super(props);
	this.initialState = {
	    observerPlanetAngle: 0,
	    targetPlanetAngle: 0,
 	    radiusTargetPlanet: 2.4,
	    radiusObserverPlanet: 1.0,
	    targetFixed: true,
	    radiusPixelTarget: 400,
	    radiusPixelObserver: 166.66,
	    observerMultiplier: Math.pow (1.0, -1.5),
            targetMultiplier:  Math.pow(2.4, -1.5),
	    animationRate: 1.5,
            targetAngle: 0,
            sunAngle: -Math.PI,
            optionObserver: 0,
            optionTarget: 0
	};

	this.state = this.initialState;
	this.raf = null;

	this.stopAnimation = this.stopAnimation.bind(this);
    }
    render() {
        let startBtnText = 'Play animation';
        if (this.state.isPlaying) {
            startBtnText = 'Pause Animation';
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
                       observerPlanetAngle={this.state.observerPlanetAngle}
                       targetPlanetAngle={this.state.targetPlanetAngle}
                       radiusTargetPlanet={this.state.radiusPixelTarget}
                       radiusObserverPlanet={this.state.radiusPixelObserver}
                       targetAU={this.state.radiusTargetPlanet}
                       observerAU={this.state.radiusObserverPlanet}
                       onObserverPlanetAngleUpdate={this.onObserverPlanetAngleUpdate.bind(this)}
                       onTargetPlanetAngleUpdate={this.onTargetPlanetAngleUpdate.bind(this)}
                       stopAnimation={this.stopAnimation}
                       targetAngle={this.state.targetAngle}
                       sunAngle={this.state.sunAngle}
                     />
                   </div>
                   <div className="rowx">
                     <div className="col">
                       <h4>Orbit Sizes</h4>

                       <div className="radObserver">
                         <form className="form-inline">
                           <label htmlFor="radObserverPlanetRange">Radius of observer planet's orbit</label>
                           <div className="radius-forms">
                             <input type="number" size="4"
                                    className="inputs"
                                    step="0.01" name="distance"
                                    min={0.25} max={10}
                                    value={this.state.radiusObserverPlanet}
                                    onChange={this.onObserverPlanetRadiusChange.bind(this)}/>
                           </div>
                           <div className="radius-forms">
                             <RangeStepInput name="radiusObserverPlanet"
                                             className="form-control-range ml-2"
                                             value={this.state.radiusObserverPlanet}
                                             onChange={this.onObserverPlanetRadiusChange.bind(this)}
                                             step={0.01}
                                             min={0.25} max={10}
                             />
                           </div>
                           <select className="form-control form-control-sm"
                                   onChange={this.onPresetSelectObserver.bind(this)}
                                   value={this.state.optionObserver}
                           >
                             <option value={0}>Preset</option>
                             <option value={1}>Mercury</option>
                             <option value={2}>Venus</option>
                             <option value={3}>Earth</option>
                             <option value={4}>Mars</option>
                             <option value={5}>Jupiter</option>
                             <option value={6}>Saturn</option>
                           </select>
                         </form>
                       </div>

                       <div className="radTarget">
                         <form className="form-inline">
                           <label htmlFor="radTargetPlanetRange">Radius of target planet's orbit</label>
                           <div className="radius-forms">
	    	             <input type="number" size="4"
                                    className="inputs"
                                    step="0.01" name="distance"
                                    min={0.25} max={10}
                                    value={this.state.radiusTargetPlanet}
                                    onChange={this.onTargetPlanetRadiusChange.bind(this)}/>
	                   </div>
                           <div className="radius-forms">
                             <RangeStepInput name="radiusTargetPlanet"
                                             className="form-control-range ml-2"
                                             value={this.state.radiusTargetPlanet}
                                             onChange={this.onTargetPlanetRadiusChange.bind(this)}
                                             step={0.01} min={0.25} max={10} />
                           </div>
                           <select className="form-control form-control-sm"
                                   onChange={this.onPresetSelectTarget.bind(this)}
                                   value={this.state.optionTarget}
                           >
                             <option value={0}>Preset</option>
                             <option value={1}>Mercury</option>
                             <option value={2}>Venus</option>
                             <option value={3}>Earth</option>
                             <option value={4}>Mars</option>
                             <option value={5}>Jupiter</option>
                             <option value={6}>Saturn</option>
                           </select>
                         </form>
                       </div>
                     </div>

                     <div className="col">
                       <h4>Animation Control</h4>
                       <button type="button" className="btn btn-primary btn-sm"
                               onClick={this.onStartClick.bind(this)}>
                         {startBtnText}
                       </button>
                       <form className="form-inline">
                         <label htmlFor="diamRange">Animation rate:</label>
                         <RangeStepInput name="animationRate"
                                         className="form-control-range ml-2"
                                         value={this.state.animationRate}
                                         onChange={this.onAnimationRateChange.bind(this)}
                                         step={0.1}
                                         min={0.1} max={3} />
                       </form>
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
        this.updateMultiplier();
        const me = this;
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

    updateMultiplier() {
        let newObserver = Math.pow(this.state.radiusObserverPlanet, -1.5);
        let newTarget = Math.pow(this.state.radiusTargetPlanet, -1.5);

        this.setState({
            targetMultiplier: newTarget,
            observerMultiplier: newObserver,
        });
    }

    onAnimationRateChange(e) {
        this.setState({
            animationRate: forceNumber(e.target.value)
        });
    }

    onPresetSelectTarget(e) {
        this.setState({
            optionTarget: e.target.value
        });

        if (e.target.value == 1) {
            this.onTargetPlanetRadiusChange(0.39);
        } else if (e.target.value == 2) {
            this.onTargetPlanetRadiusChange(0.72);
        } else if (e.target.value == 3) {
            this.onTargetPlanetRadiusChange(1.00);
        } else if (e.target.value == 4) {
            this.onTargetPlanetRadiusChange(1.52);
        } else if (e.target.value == 5) {
            this.onTargetPlanetRadiusChange(5.20);
        } else if (e.target.value == 6) {
            this.onTargetPlanetRadiusChange(9.54);
        }

    }

    onPresetSelectObserver(e) {
        this.setState({
            optionObserver: e.target.value
        });

        if (e.target.value == 1) {
            this.onObserverPlanetRadiusChange(0.39);
        } else if (e.target.value == 2) {
            this.onObserverPlanetRadiusChange(0.72);
        } else if (e.target.value == 3) {
            this.onObserverPlanetRadiusChange(1.00);
        } else if (e.target.value == 4) {
            this.onObserverPlanetRadiusChange(1.52);
        } else if (e.target.value == 5) {
            this.onObserverPlanetRadiusChange(5.20);
        } else if (e.target.value == 6) {
            this.onObserverPlanetRadiusChange(9.54);
        }
    }

    onObserverPlanetRadiusChange(e) {
        let au = 0;
        if (typeof(e) === 'object') {
    	    au = e.target.value;
        } else {
            au = e;
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
    changeTarget(au) {
        let ratio = (this.state.radiusTargetPlanet / au) * 400;

        this.setState({
            radiusObserverPlanet: forceNumber(au),
            radiusPixelTarget: forceNumber(ratio),
            radiusPixelObserver: 400,
        });
    }
    onTargetPlanetRadiusChange(e) {

        let au = 0;
        if (typeof(e) === 'object') {
    	    au = e.target.value;
        } else {
            au = e;
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
    changeObserver(au) {
        let ratio = (this.state.radiusObserverPlanet / au) * 400;

        this.setState({
            radiusTargetPlanet: forceNumber(au),
            radiusPixelObserver: forceNumber(ratio),
            radiusPixelTarget: 400,
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
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<PlanetaryConfigSim />, domContainer);
