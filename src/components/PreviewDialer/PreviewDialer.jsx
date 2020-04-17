import React from 'react';
import sharedTheme from '../../styling/theme';
import { withStyles } from '@material-ui/core/styles';
import CSVReader from 'react-csv-reader'
import Button from '@material-ui/core/Button';
import { Icon } from '@twilio/flex-ui';
import CalendarIcon from './CalendarIcon';
import { request } from '../../helpers/request';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { getAttributes } from '../../helpers/configuration';
import ScheduleDialog from './ScheduleDialog';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => (sharedTheme(theme));

class PreviewDialer extends React.Component {

    state = { 
        contacts: [],
        campaign: { name: "Default"},
        openScheduler: false,
        schedule: null
    };

    handleFile = data => {
        if(data) {
            this.setState({ 
                contacts: data 
            });
        }
    }

    handleCall = () => {
        request("preview-dialer/create-task", this.props.manager, { 
            contacts: JSON.stringify(this.state.contacts),
            campaign: this.state.campaign.name 
        });
    }

    handleChange = event => {
        const campaignName = event.target.value;
        const { campaigns } = getAttributes(this.props.manager); 

        const campaign = campaigns.find(({ name }) => campaignName === name ) || {};

        this.setState({ schedule: campaign.schedule });
        this.setState({ campaign });
    }

    render() {
        const { classes, manager } = this.props;
        const disabled = this.state.contacts.length === 0;

        const { campaigns } = getAttributes(manager); 

        return (
            <div className={classes.boxDialpad}>

                <div className={classes.titleAgentDialpad}>Preview Dialer</div>

                <FormControl className={classes.formControl}>
                    
                    <div className={classes.labelBox}>
                        <div className={classes.csvLabel}>Campaign</div>
                        <Select
                            labelId="select-label"
                            value={this.state.campaign.name}
                            onChange={this.handleChange}
                            isClearable
                            style={{
                                width: '100%'
                            }}
                        >
                             <MenuItem value="" key="label" disabled>
                                Select a campaign (optional)
                            </MenuItem>

                            {
                                campaigns && campaigns.map(({ name }) => (
                                    <MenuItem value={name} key={`select_${name}`}>
                                        {name}
                                    </MenuItem>
                                ))
                            }
                                    
                        </Select>
                    </div>

                    <div className={classes.labelBox}>
                        <div className={classes.csvLabel}>Select CSV file</div>
                        <CSVReader 
                            onFileLoaded={this.handleFile} 
                            parserOptions={{
                                header: true,
                                skipEmptyLines: true
                            }}
                        />
                        <div className={classes.buttonBoxPreviewDialer}>
                            <Tooltip title="Schedule the calls">
                                <Button 
                                        variant="contained" 
                                        color="primary" 
                                        disabled={disabled}
                                        onClick={() => this.setState({ openScheduler: true })}
                                        className={classes.scheduleDialerBtn}
                                    >
                                    <CalendarIcon />
                                </Button>
                            </Tooltip>

                            <Tooltip title="Call now">
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    disabled={this.state.schedule || disabled}
                                    onClick={this.handleCall}
                                    className={classes.previewDialerBtn}
                                >
                                    <Icon icon="Call"/>
                                </Button>
                            </Tooltip>
                        
                        </div>
                    </div>
   
                </FormControl>

               <ScheduleDialog 
                    open={this.state.openScheduler} 
                    onClose={() => this.setState({ openScheduler: false })}
                    campaign={this.state.campaign}
                    contacts={this.state.contacts}
                    manager={this.props.manager}
               />
            
            </div>
        )   
    }
}

export default withStyles(styles)(PreviewDialer);