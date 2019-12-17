'use strict';

module.exports = (_, model, state) => 

_.div({class: `widget widget--date-time ${model.disabled ? 'disabled' : ''}`},
    _.if(model.disabled,
        state.output,
    ),
    _.if(!model.disabled, 
        _.input({class: 'widget--date-time__field year', type: 'number', placeholder: 'YYYY', min: 0, value: state.year, onchange: (e) => _.onChangeYear(e.target)}),
        _.span({class: 'widget--date-time__separator'}, '/'),
        _.input({class: 'widget--date-time__field month', type: 'number', placeholder: 'MM', min: 1, max: 12, value: state.month, onchange: (e) => _.onChangeMonth(e.target)}),
        _.span({class: 'widget--date-time__separator'}, '/'),
        _.input({class: 'widget--date-time__field date', type: 'number', placeholder: 'DD', min: 1, max: state.maxDate, value: state.date, onchange: (e) => _.onChangeDate(e.target)}),
        _.span({class: 'widget--date-time__separator hard'}),
        _.input({class: 'widget--date-time__field hour', type: 'number', placeholder: 'hh', min: 0, max: 23, value: state.hour, onchange: (e) => _.onChangeHour(e.target)}),
        _.span({class: 'widget--date-time__separator'}, ':'),
        _.input({class: 'widget--date-time__field minute', type: 'number', placeholder: 'mm', min: 0, max: 59, value: state.minute, onchange: (e) => _.onChangeMinute(e.target)}),
        _.span({class: 'widget--date-time__separator'}, ':'),
        _.input({class: 'widget--date-time__field second', type: 'number', placeholder: 'ss', min: 0, max: 59, value: state.second, onchange: (e) => _.onChangeSecond(e.target)}),
        _.button({class: 'widget--date-time__clear fa fa-remove', title: 'Clear', onclick: _.onClickClear}) 
    )
)
