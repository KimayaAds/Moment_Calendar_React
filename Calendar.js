import React from "react";
import moment from 'moment';
import "./Calendar.css";

class Calendar extends React.Component{
    state ={
        dateContext: moment(),
        today: moment(),
        showMonthPopup : false,
        showYearPopup:false
    }
    constructor(props){
        super(props);
            this.width = props.width || "350px";
            this.style = props.style || {};
            this.style.width = this.width;

        }
        

     
        weekdays = moment.weekdays();//["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",]
        weekdaysShort = moment.weekdaysShort();// short form of the days
        months=moment.months();
        

    year = () => {
        return this.state.dateContext.format("Y");

    }
    month =() =>{
        return this.state.dateContext.format("MMMM");
        }

    daysInMonth = () =>{
        return this.state.dateContext.daysInMonth();
    }
    currentDate =()=>{
        return this.state.dateContext.get("date");

    }
    currentDay =()=>{
        return this.state.dateContext.format("D");
    }
    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');//Day of week 0...1...2...3..4......5...
        return firstDay;
    }
    setMonth =(month)=>{
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month",monthNo);
        this.setState({
            dateContext:dateContext
        });
    }
    onSelectChange = ( e, data )=>{
        this.setMonth(data);
        this.props.onMonthChanage && this.props.onMonthChange();
        
        
    }
    SelectList= (props)=> {
        let popup = props.data.map((data)=>{
            return(
                <div key={data}>
                    <a href="#" onClick={(e)=>{this.onSelectChange(e,data)}}>
                        {data}
                        </a>
                    </div>
            )
        });
    
    return(
        <div className="month-popup">
            {popup}
            </div>
    );
    }
    onChangeMonth = (e,month)=>{
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav = () => {
        return (
            <span className="label-month"
            onClick={(e)=>{this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonthPopup &&
                <this.SelectList data={this.months} />
                }
                </span>
        );
    }

/// Year Navigation
showYearEditor =() =>{
    this.setState({
        showYearNav: true

    });
}
setYear =(year)=>{
    let dateContext = Object.assign({}, this.state.dateContext);    
    dateContext = moment(dateContext).set("year",year);
    this.setState({
        dateContext: dateContext
    })
}
onYearChange =(e)=>{
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange(e, e.target.value)
}
YearNav=()=>{
    return(
        this.state.showYearNav?
        <input 
        defaultValue ={this.year()}
        className="editor-year"
        ref={(yearInput)=>{ this.yearInput= yearInput}}
       onKeyUp={(e)=>this.onKeyUpYear(e)} 
       onChange = {(e)=> this.onYearChange(e)}
       type="number"
       placeholder="year"/>
        :
        <span 
        className="label-year"
            onDoubleClick={(e)=>{this.showYearEditor()}}>
            {this.year()}
            </span>
    );
}

    render (){
        // Map the weekdays i.e. Sun ,Mon, Tue as <td>
        let Weekdays = this.weekdaysShort.map((day)=>{
            return(
                <td key={day} className="week-day" >{day}</td>
            )
        });
        let blanks = [];
        for (let i=0; i<this.firstDayOfMonth(); i++){
            blanks.push(<td key={i*80}className="emptySlot">
            {""}
            </td>
            );
        }
        console.log("blanks:", blanks);
        let daysInMonth =[];
        for (let d = 1; d <= this.daysInMonth();d++){
            let className = (d===this.currentDay()? "day current-day":"day");
            daysInMonth.push(
                <td key={d} className={className}>
                    <span>{d}</span>
                    </td>
            )
        }
        console.log("days:",daysInMonth);
        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells =[];
        totalSlots.forEach((row,i)=>{
            if ((i%7)!== 0){
                cells.push(row);
            }else{
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i===totalSlots.length-1){
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
        });
        let trElems = rows.map((d ,i )=>{
            return(
                <tr key={i*100}>
                    {d}
                </tr>
            );
        })

        return (
            <div className="calendar-container" style={this.style}>
                <table className="calendar">
                <thead>
                   <tr className="calendar-header">
                       <td colSpan="5">
                           
                           <this.MonthNav/>
                           {" "}
                           <this.YearNav />
                           </td>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                    {Weekdays}
                    </tr>
                    {trElems}
                    </tbody>
                    </table>
                </div>
        );

    }
}

export default Calendar;