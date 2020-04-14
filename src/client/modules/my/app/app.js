import { LightningElement } from 'lwc';
import { DEFAULT_STATE } from './constants';

const setState = (state, newState) => ({ ...state, ...newState });

export default class App extends LightningElement {
    state = DEFAULT_STATE;

    handleChange(event) {
        console.log(event);
        this.updateState({
            [event.target.name]: event.target.value
        });
    }

    handleSave(event) {
        event.stopPropagation();

        if (this.state.firstName === 'A') {
            throw new Error('BOOM');
        }
    }

    get invalid() {
        const { state } = this;

        return Object.keys(state).filter((x) => state[x] === '').length > 0;
    }

    get buttonClasses() {
        return this.invalid
            ? 'py-1 px-3 text-white bg-blue-400 opacity-50 cursor-not-allowed rounded-lg'
            : 'py-1 px-3 text-white bg-blue-400 rounded-lg';
    }

    updateState(newState) {
        this.state = setState(this.state, newState);
    }
}
