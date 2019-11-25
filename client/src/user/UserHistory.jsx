import React, { PureComponent } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const historyData = [
    {
        day: "05-01", games: 4000, wins: 2400
    },
    {
        day: "06-01", games: 3000, wins: 1398
    },
    {
        day: "07-01", games: 2000, wins: 200
    },
    {
        day: "08-01", games: 2780, wins: 2780
    },
    {
        day: "09-01", games: 1890, wins: 100
    },
    {
        day: "10-01", games: 3800, wins: 2390
    },
    {
        day: "11-01", games: 4300, wins: 3490
    },
];

export default class UserHistory extends PureComponent {
    render() {
        return (
            <AreaChart
                width={500}
                height={400}
                data={historyData}
                margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                }} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={this.formatLabel} />
                <Area type="monotone" dataKey="games" stroke="rgba(207, 73, 80, 0.8)" fill="rgba(207, 73, 80, 0.8)" />
                <Area type="monotone" dataKey="wins" stroke="#7289da" fill="#7289da" />
            </AreaChart>
        );
    }

    formatLabel(value,  name, props) {
        console.log(props);
        return <span>{value.toUpperCase()}</span>;
    }
}