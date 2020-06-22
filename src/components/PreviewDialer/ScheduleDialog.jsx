import React from 'react';
import sharedTheme from '../../styling/theme';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { request } from '../../helpers/request';
import InputMask from "react-input-mask";

const DAYS = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const styles = theme => (sharedTheme(theme));

class ScheduleDialog extends React.Component {

    state = {
        selected: DAYS,
        startHour: "0000",
        endHour: "2359",
        allDisabled: false
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.campaign && nextProps.campaign.schedule) {

            const { week, startHour, endHour } = nextProps.campaign.schedule
            
            this.setState({ allDisabled: true });

            this.setState({ 
                selected: week || [], 
                startHour: startHour || "0000",
                endHour: endHour || "2359",
                allDisabled: true 
            });
           
        } else {

            this.setState({
                selected: DAYS,
                startHour: "0000",
                endHour: "2359",
                allDisabled: false
            });

        }

    }

    handleChange = (event) => {
        const { name, checked } = event.target;

        console.log(name, checked);

        if(name === "All") {
            this.setState({ selected: checked ? DAYS : [] })
        } else {
            this.setState( { selected: checked ? 
                [...this.state.selected, name ] : 
                this.state.selected.filter(elem => elem !== name)
            })
        }
    };

    handleCall = () => {
        request("preview-dialer/create-task", this.props.manager, { 
            contacts: JSON.stringify(this.props.contacts),
            campaign: this.props.campaign.name,
            schedule: JSON.stringify({
                week: this.state.selected.filter(elem => elem !== "All"),
                startHour: (this.state.startHour).replace(":", ""),
                endHour: (this.state.endHour).replace(":", "")
            })  
        });
        this.props.onClose();
    }

    render() {
        const { open, onClose, classes } = this.props;
        const { selected, allDisabled } = this.state;

        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <DialogContentText>
                        Schedule Preview Dialer
                    </DialogContentText>
                    {allDisabled && <div className={classes.alertBox}>
                        This campaign has the following default schedule
                    </div>}
                    <div className={classes.scheduleForm}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Days of the Week</FormLabel>
                            <FormGroup row>
                                {DAYS.map(day => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={selected.includes(day)}
                                                color="primary"
                                                onChange={this.handleChange} 
                                                name={day}
                                                disabled={(selected.length === 8 && day !== "All") || allDisabled}
                                            />}
                                        label={day}
                                        labelPlacement="end"
                                    />
                                ))}
                            </FormGroup>
                            <div className={classes.dateBox}>
                                <div className={classes.dateInputBox}>
                                    <FormLabel component="legend">Start Hour</FormLabel>
                                    <InputMask 
                                        mask="99:99"
                                        value={this.state.startHour}
                                        onChange={(event) => this.setState({ startHour: event.target.value })}
                                        className={classes.dateInput}
                                        disabled={allDisabled}
                                    ></InputMask>
                                </div>
                                <div className={classes.dateInputBox}>
                                    <FormLabel component="legend">End Hour</FormLabel>
                                    <InputMask 
                                        mask="99:99"
                                        value={this.state.endHour}
                                        onChange={(event) => this.setState({ endHour: event.target.value })}
                                        className={classes.dateInput}
                                        disabled={allDisabled}
                                    ></InputMask>
                                </div>
                            </div>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={this.handleCall}
                    >
                        Schedule
                    </Button>
                    <Button
                        onClick={onClose}
                        color="secondary"
                    >
                        Exit
                    </Button>
                </DialogActions>
            </Dialog>
        )   
    }
}

export default withStyles(styles)(ScheduleDialog);