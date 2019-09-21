import React, {Component} from "react";
import styles from './StartScreen.module.css';

type StartScreenProps = {
    doLogin: () => void
};
type StartScreenState = {};

export class StartScreen extends Component<StartScreenProps, StartScreenState> {
    render() {
        return (<div className={styles.StartScreen}>
            <p>Please, <a onClick={this.props.doLogin}>log in</a> to see stats</p>
        </div>);
    }
}
