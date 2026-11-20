(function () {
'use strict';
const C = window.ExpenseCore;
const LAYOUTS = {"itemized":{"range":"A1:Q40","cols":[195.75,91.5,54.0,87.75,52.5,99.75,52.5,84.75,52.5,86.25,54.0,91.5,51.0,84.75,52.5,114.75,71.25],"rows":[72.0,22.8,22.8,22.8,22.8,22.8,22.8,15.6,25.2,30.0,30.0,30.0,30.0,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,25.05,24.75,25.05,25.05,24.75,24.6,24.6,24.6,24.6,24.6,24.0,24.0],"margins":{"left":18.0,"right":18.0,"top":21.599999999999998,"bottom":20.160000000000004},"styles":[{"fn":"Arial","sz":72.0,"b":true,"i":true,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":36.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"left","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"mm-dd-yy"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFF00","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFF00","bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":true,"i":false,"u":false,"fc":"000000","fill":"FFFF00","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":20.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["medium","000000"],"bt":null,"bb":["medium","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":null,"br":["thin","000000"],"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["thin","000000"],"br":null,"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":null,"br":null,"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["medium","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["thin","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFF00","bl":["medium","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["medium","000000"],"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["thin","000000"],"bt":null,"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"[$$-1009]#,##0.00;\\-[$$-1009]#,##0.00"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":null,"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":null,"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"[$$-1009]#,##0.00;\\-[$$-1009]#,##0.00"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":null,"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":null,"bb":["thin","000000"],"ha":"center","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"[$$-1009]#,##0.00;\\-[$$-1009]#,##0.00"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["thin","000000"],"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"[$$-1009]#,##0.00;\\-[$$-1009]#,##0.00"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["thin","000000"],"bb":["thin","000000"],"ha":"center","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":"left","va":"center","wrap":true,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":null,"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"right","va":"center","wrap":false,"nf":"[$$-1009]#,##0.00;\\-[$$-1009]#,##0.00"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["thin","000000"],"bb":null,"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"right","va":"center","wrap":false,"nf":"[$$-1009]#,##0.00;\\-[$$-1009]#,##0.00"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["thin","000000"],"bb":null,"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":20.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"[$$-1009]#,##0.00"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Arial","sz":12.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"mmm-yy"}],"cells":[["A1",0,"evertz"],["D1",1,"    EXPENSE CLAIM REPORT"],["L2",2,"WEEK ENDING"],["N2",3],["O2",4],["P2",4],["L3",2,"NAME"],["N3",5],["O3",4],["P3",4],["K4",6],["L4",7,"DEPARTMENT"],["N4",8],["O4",9],["P4",9],["K5",10,"MANAGER NAME"],["L5",7],["N5",8],["O5",8],["P5",8],["L6",2,"YOUR ADDRESS (ONLY INDICATE IF CHANGED"],["N6",8],["O6",9],["P6",9],["L7",11,"SINCE LAST EXPENSE)"],["N7",8],["O7",9],["P7",9],["A9",12],["B9",13,"Sunday"],["C9",14],["D9",15,"Monday"],["E9",14],["F9",15,"Tuesday"],["G9",14],["H9",16,"Wednesday"],["I9",17],["J9",15,"Thursday"],["K9",14],["L9",15,"Friday"],["M9",14],["N9",15,"Saturday"],["O9",18],["P9",19,"             Total"],["Q9",20],["A10",21,"Date"],["B10",22],["C10",23],["D10",24],["E10",23],["F10",24],["G10",23],["H10",24],["I10",23],["J10",24],["K10",23],["L10",24],["M10",23],["N10",24],["O10",25],["P10",26],["Q10",27],["A11",28,"Customer:"],["B11",29],["C11",30],["D11",31],["E11",30],["F11",31],["G11",30],["H11",31],["I11",30],["J11",31],["K11",30],["L11",31],["M11",30],["N11",31],["O11",32],["P11",33],["Q11",34],["A12",28,"Location"],["B12",35],["C12",36],["D12",37],["E12",36],["F12",37],["G12",36],["H12",37],["I12",36],["J12",37],["K12",36],["L12",37],["M12",36],["N12",37],["O12",38],["P12",39],["Q12",34],["A13",40],["B13",41,"Charge"],["C13",42,"HST"],["D13",43,"Charge"],["E13",42,"HST"],["F13",43,"Charge"],["G13",42,"HST"],["H13",43,"Charge"],["I13",42,"HST"],["J13",43,"Charge"],["K13",42,"HST"],["L13",43,"Charge"],["M13",42,"HST"],["N13",43,"Charge"],["O13",42,"HST"],["P13",44,"Charge"],["Q13",45,"HST"],["A14",46,"Air 'Fare"],["B14",47],["C14",48],["D14",49],["E14",48],["F14",49],["G14",48],["H14",49],["I14",48],["J14",49],["K14",48],["L14",49],["M14",48],["N14",49],["O14",48],["P14",50],["Q14",51],["A15",46,"Airport Tax"],["B15",52],["C15",53],["D15",54],["E15",53],["F15",54],["G15",53],["H15",54],["I15",53],["J15",54],["K15",53],["L15",54],["M15",53],["N15",54],["O15",53],["P15",55],["Q15",56],["A16",46,"Breakfast"],["B16",52],["C16",53],["D16",54],["E16",53],["F16",54],["G16",53],["H16",54],["I16",53],["J16",54],["K16",53],["L16",54],["M16",53],["N16",54],["O16",53],["P16",55],["Q16",56],["A17",46,"Lunch - food"],["B17",52],["C17",53],["D17",54],["E17",53],["F17",54],["G17",53],["H17",54],["I17",53],["J17",54],["K17",53],["L17",54],["M17",53],["N17",54],["O17",53],["P17",55],["Q17",56],["A18",57,"Lunch - alcohol"],["B18",52],["C18",53],["D18",54],["E18",53],["F18",54],["G18",53],["H18",54],["I18",53],["J18",54],["K18",53],["L18",54],["M18",53],["N18",54],["O18",53],["P18",55],["Q18",56],["A19",46,"Dinner - food"],["B19",52],["C19",53],["D19",54],["E19",53],["F19",54],["G19",53],["H19",54],["I19",53],["J19",54],["K19",53],["L19",54],["M19",53],["N19",54],["O19",53],["P19",55],["Q19",56],["A20",57,"Dinner - alcohol"],["B20",52],["C20",53],["D20",54],["E20",53],["F20",54],["G20",53],["H20",54],["I20",53],["J20",54],["K20",53],["L20",54],["M20",53],["N20",54],["O20",53],["P20",55],["Q20",56],["A21",46,"Late Meal/Overtime"],["B21",52],["C21",53],["D21",54],["E21",53],["F21",54],["G21",53],["H21",54],["I21",53],["J21",54],["K21",53],["L21",54],["M21",53],["N21",54],["O21",53],["P21",55],["Q21",56],["A22",46,"Snacks"],["B22",52],["C22",53],["D22",54],["E22",53],["F22",54],["G22",53],["H22",54],["I22",53],["J22",54],["K22",53],["L22",54],["M22",53],["N22",54],["O22",53],["P22",55],["Q22",56],["A23",46,"Hotel"],["B23",52],["C23",53],["D23",54],["E23",53],["F23",54],["G23",53],["H23",54],["I23",53],["J23",54],["K23",53],["L23",54],["M23",53],["N23",54],["O23",53],["P23",55],["Q23",56],["A24",46,"Auto Rental "],["B24",52],["C24",53],["D24",54],["E24",53],["F24",54],["G24",53],["H24",54],["I24",53],["J24",54],["K24",53],["L24",54],["M24",53],["N24",54],["O24",53],["P24",55],["Q24",56],["A25",46,"Entertainment (sales only)"],["B25",52],["C25",53],["D25",54],["E25",53],["F25",54],["G25",53],["H25",54],["I25",53],["J25",54],["K25",53],["L25",54],["M25",53],["N25",54],["O25",53],["P25",55],["Q25",56],["A26",46,"Parking"],["B26",52],["C26",53],["D26",54],["E26",53],["F26",54],["G26",53],["H26",54],["I26",53],["J26",54],["K26",53],["L26",54],["M26",53],["N26",54],["O26",53],["P26",55],["Q26",56],["A27",46,"Taxi"],["B27",52],["C27",53],["D27",54],["E27",53],["F27",54],["G27",53],["H27",54],["I27",53],["J27",54],["K27",53],["L27",54],["M27",53],["N27",54],["O27",53],["P27",55],["Q27",56],["A28",46,"Tips"],["B28",52],["C28",53],["D28",54],["E28",53],["F28",54],["G28",53],["H28",54],["I28",53],["J28",54],["K28",53],["L28",54],["M28",53],["N28",54],["O28",53],["P28",55],["Q28",56],["A29",46,"Fuel"],["B29",52],["C29",53],["D29",54],["E29",53],["F29",54],["G29",53],["H29",54],["I29",53],["J29",54],["K29",53],["L29",54],["M29",53],["N29",54],["O29",53],["P29",55],["Q29",56],["A30",58,"Mileage (@.70/M, .58/Km)"],["B30",52],["C30",53],["D30",54],["E30",53],["F30",54],["G30",53],["H30",54],["I30",53],["J30",54],["K30",53],["L30",54],["M30",53],["N30",54],["O30",53],["P30",55],["Q30",56],["A31",59,"Miscellaneous"],["B31",60],["C31",61],["D31",62],["E31",61],["F31",62],["G31",61],["H31",62],["I31",61],["J31",62],["K31",61],["L31",62],["M31",61],["N31",62],["O31",61],["P31",63],["Q31",64],["A32",65,"Total"],["B32",66],["C32",67],["D32",68],["E32",67],["F32",69],["G32",67],["H32",69],["I32",67],["J32",69],["K32",67],["L32",69],["M32",67],["N32",69],["O32",67],["P32",70],["Q32",71],["A33",72,"Actual Mileage:"],["M33",73],["E34",74,"AMOUNT"],["F34",75],["G34",4],["H34",4],["I34",4],["J34",4],["K34",4],["L34",4],["A35",74,"A/C"],["B35",76],["C35",76],["E35",74,"Amount"],["F35",76],["G35",77],["H35",76],["A36",74,"A/C"],["B36",78],["C36",78],["E36",74,"Amount"],["F36",79," "],["G36",80],["H36",78],["A37",74,"A/C"],["B37",78],["C37",78],["E37",74,"Amount"],["F37",79," "],["G37",78],["H37",78],["J37",74,"P.J."],["K37",76],["L37",76],["N37",74,"Signature"],["O37",76],["P37",76],["Q37",76],["A38",74,"A/C"],["B38",78],["C38",78],["E38",74,"Amount"],["F38",79," "],["G38",80],["H38",78],["J38",74,"Cheque #"],["K38",78],["L38",78],["N38",74,"Approved"],["O38",78],["P38",78],["Q38",78],["A39",74,"A/C"],["B39",78],["C39",78],["E39",74,"Amount"],["F39",79," "],["G39",78],["H39",78],["J39",74,"Date Paid"],["K39",78],["L39",78],["N39",74,"Date"],["O39",78],["P39",78],["Q39",78],["P40",81,"Revised"],["Q40",82,{"d":44896}]],"merges":["F34:H34","N7:P7","D1:L1","N2:P2","N6:P6","N4:P4","H9:I9","N3:P3"]},"perdiem":{"range":"A1:W35","cols":[5.25,63.75,78.75,115.5,60.0,63.0,59.25,59.25,59.25,59.25,59.25,59.25,59.25,59.25,59.25,59.25,59.25,59.25,59.25,59.25,90.75,47.25,63.75],"rows":[16.5,60.75,10.5,18.0,24.0,17.4,17.4,17.4,17.4,24.75,19.5,16.5,16.5,51.0,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,12.75,15.0,15.0,12.75,12.75,12.75,12.75,12.75,12.75,12.75],"margins":{"left":50.4,"right":50.4,"top":54.0,"bottom":54.0},"styles":[{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":72.0,"b":true,"i":true,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":36.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"left","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["medium","000000"],"ha":"left","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":true,"u":false,"fc":"7030A0","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":"center","va":null,"wrap":true,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"FFFFFF","fill":"A14817","bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"FFFFFF","fill":"A14817","bl":["thin","808080"],"br":null,"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"FFFFFF","fill":"A14817","bl":["thin","D9D9D9"],"br":["thin","D9D9D9"],"bt":["thin","000000"],"bb":["thin","808080"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"000000","fill":"8497B0","bl":["thin","D9D9D9"],"br":["thin","D9D9D9"],"bt":["thin","000000"],"bb":["thin","808080"],"ha":"center","va":"center","wrap":true,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"000000","fill":"8497B0","bl":null,"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"7030A0","fill":"8497B0","bl":null,"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","000000"],"br":null,"bt":["thin","808080"],"bb":null,"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","808080"],"bb":null,"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","808080"],"bb":null,"ha":"center","va":null,"wrap":false,"nf":"\"$\"#,##0.00_);[Red]\\(\"$\"#,##0.00\\)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":null,"br":["thin","000000"],"bt":["thin","808080"],"bb":null,"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":["thin","000000"],"br":null,"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"\"$\"#,##0.00_);[Red]\\(\"$\"#,##0.00\\)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","000000"],"br":null,"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"\"$\"#,##0.00_);[Red]\\(\"$\"#,##0.00\\)"},{"fn":"Tahoma","sz":8.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","C0C0C0"],"bt":null,"bb":null,"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":null,"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"C0C0C0","fill":"C0C0C0","bl":["thin","808080"],"br":null,"bt":null,"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"C0C0C0","fill":"C0C0C0","bl":["thin","000000"],"br":["thin","808080"],"bt":["thin","000000"],"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"C0C0C0","fill":"C0C0C0","bl":["thin","808080"],"br":["thin","000000"],"bt":["thin","000000"],"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":true,"u":true,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"left","va":null,"wrap":true,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":true,"i":false,"u":false,"fc":"333333","fill":null,"bl":null,"br":null,"bt":["thin","808080"],"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","808080"],"br":null,"bt":null,"bb":null,"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","000000"],"br":["thin","808080"],"bt":["thin","808080"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","808080"],"br":["thin","000000"],"bt":["thin","808080"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":true,"i":false,"u":false,"fc":"333333","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","808080"],"br":["thin","808080"],"bt":["thin","C0C0C0"],"bb":["thin","C0C0C0"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":true,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","808080"],"br":["thin","808080"],"bt":null,"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":true,"u":false,"fc":"7030A0","fill":"FFF2CC","bl":null,"br":null,"bt":["thin","000000"],"bb":null,"ha":"center","va":null,"wrap":true,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":true,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"left","va":"top","wrap":true,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":11.0,"b":false,"i":false,"u":true,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":null,"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":11.0,"b":false,"i":false,"u":true,"fc":"000000","fill":"FFE699","bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":11.0,"b":false,"i":true,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":"left","va":null,"wrap":false,"nf":"_(* #,##0.00_);_(* \\(#,##0.00\\);_(* \"-\"??_);_(@_)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"mm-dd-yy"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":["thin","000000"],"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":["thin","000000"],"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":["thin","000000"],"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"}],"cells":[["A1",0],["B1",1],["C1",1],["D1",1],["E1",1],["F1",1],["G1",1],["H1",1],["I1",1],["J1",1],["U1",1],["A2",2,"evertz"],["F2",3,"TRAVEL EXPENSE REPORT"],["L4",4,"WEEK ENDING"],["N4",5],["O4",6],["P4",6],["Q4",6],["L5",4,"NAME"],["N5",7],["O5",8],["P5",8],["Q5",8],["L6",4,"DEPARTMENT"],["N6",9],["O6",10],["P6",10],["Q6",11],["L7",4,"CUSTOMER TRIP"],["N7",12],["O7",12],["P7",12],["Q7",13],["L8",4,"TRIP DESTINATION"],["N8",13],["O8",13],["P8",13],["Q8",13],["N9",13],["O9",13],["P9",13],["Q9",13],["L10",4,"YOUR ADDRESS (ONLY INDICATE IF CHANGED"],["N10",12],["O10",14],["P10",14],["Q10",13],["L11",4,"SINCE LAST EXPENSE)"],["N11",12],["O11",14],["P11",14],["Q11",13],["V13",15,"Internal Use Only"],["W13",16],["B14",17,"Receipt #"],["C14",18,"Date"],["D14",19,"Description"],["E14",19,"Currency*"],["F14",19,"Amount"],["G14",20,"Airfare / Train"],["H14",20,"Breakfast"],["I14",20,"Lunch"],["J14",20,"Dinner"],["K14",20,"Late Meal / Overtime"],["L14",20,"Per Diem"],["M14",20,"Snacks / Incidentals"],["N14",20,"Hotel"],["O14",20,"Auto Rental"],["P14",20,"Parking"],["Q14",20,"Taxi"],["R14",20,"Fuel"],["S14",20,"Mileage (@.55/M, .50/KM)"],["T14",20,"Other"],["U14",21,"Total"],["V14",22,"HST"],["W14",22,"Net of HST"],["B15",23],["C15",24],["D15",25],["E15",25],["F15",26],["G15",27],["H15",27],["I15",27],["J15",27],["K15",27],["L15",27],["M15",27],["N15",27],["O15",27],["P15",27],["Q15",27],["R15",27],["S15",27],["T15",27],["U15",28],["V15",28],["W15",28],["B16",29],["C16",30],["D16",31],["E16",31],["F16",32],["G16",31],["H16",31],["I16",31],["J16",31],["K16",31],["L16",31],["M16",31],["N16",31],["O16",31],["P16",31],["Q16",31],["R16",31],["S16",31],["T16",31],["U16",28],["V16",28],["W16",28],["B17",33],["C17",24],["D17",27],["E17",27],["F17",34],["G17",27],["H17",27],["I17",27],["J17",27],["K17",27],["L17",27],["M17",27],["N17",27],["O17",27],["P17",27],["Q17",27],["R17",27],["S17",27],["T17",27],["U17",28],["V17",28],["W17",28],["B18",29],["C18",30],["D18",31],["E18",31],["F18",32],["G18",35],["H18",31],["I18",31],["J18",31],["K18",31],["L18",31],["M18",31],["N18",31],["O18",31],["P18",31],["Q18",31],["R18",31],["S18",31],["T18",31],["U18",28],["V18",28],["W18",28],["B19",33],["C19",24],["D19",27],["E19",27],["F19",34],["G19",27],["H19",27],["I19",27],["J19",27],["K19",27],["L19",27],["M19",27],["N19",27],["O19",27],["P19",27],["Q19",27],["R19",27],["S19",27],["T19",27],["U19",28],["V19",28],["W19",28],["B20",29],["C20",30],["D20",31],["E20",31],["F20",32],["G20",31],["H20",31],["I20",31],["J20",31],["K20",31],["L20",31],["M20",31],["N20",31],["O20",31],["P20",31],["Q20",31],["R20",31],["S20",31],["T20",31],["U20",28],["V20",28],["W20",28],["B21",33],["C21",24],["D21",27],["E21",27],["F21",34],["G21",27],["H21",27],["I21",27],["J21",27],["K21",27],["L21",27],["M21",27],["N21",27],["O21",27],["P21",27],["Q21",27],["R21",27],["S21",27],["T21",27],["U21",28],["V21",28],["W21",28],["F22",36],["G22",37],["H22",37],["I22",37],["J22",37],["K22",37],["L22",37],["M22",37],["N22",37],["O22",37],["P22",37],["Q22",37],["R22",37],["S22",37],["T22",37],["U22",38],["V22",39],["W22",40],["B23",41,"Please indicate receipt number on actual receipt, for proper referencing, and list in chronological order."],["S23",42,"Subtotal"],["U23",43],["V23",44],["W23",45],["S24",46,"Advances"],["U24",47],["B25",48,"*Please report one currency per report."],["S25",46,"Total"],["U25",49],["B27",50],["C27",51,"Internal Use Only"],["D27",52],["E27",53],["F27",53],["G27",53],["H27",53],["I27",53],["J27",53],["K27",54],["M27",55,"Per Diem Calculator\n(based on above noted Trip Destination)"],["N27",52],["O27",52],["P27",52],["Q27",56],["B28",57],["C28",58],["D28",58],["E28",58],["F28",59],["G28",60],["H28",61],["I28",61],["J28",58],["K28",62],["M28",63],["Q28",64],["B29",57,"A/C"],["C29",65],["D29",58],["E29",59,"Amount"],["F29",65],["G29",58],["H29",59,"P.J."],["I29",65],["J29",65],["K29",62],["M29",66],["N29",67],["O29",68,"USD$"],["P29",69,"Local Currency"],["Q29",64],["S29",70,"Signature"],["T29",71],["U29",71],["B30",57,"A/C"],["C30",72],["D30",58],["E30",59,"Amount"],["F30",72],["G30",58],["H30",59],["I30",58],["J30",58],["K30",62],["M30",73,"Per Diam - Full Day"],["N30",67],["O30",74,100],["P30",75,100],["Q30",64],["B31",57,"A/C"],["C31",72],["D31",58],["E31",59,"Amount"],["F31",72],["G31",58],["H31",59,"Cheque #"],["I31",65],["J31",65],["K31",62],["M31",73,"Per Diam - Partial Day"],["N31",76],["O31",74,50],["P31",75,50],["Q31",64],["S31",70,"Approved"],["T31",71],["U31",71],["B32",57,"A/C"],["C32",72],["D32",58],["E32",59,"Amount"],["F32",72],["G32",58],["H32",59],["I32",58],["J32",58],["K32",62],["M32",77],["N32",76],["O32",76],["P32",76],["Q32",78],["B33",57,"A/C"],["C33",72],["D33",58],["E33",59,"Amount"],["F33",72],["G33",58],["H33",59,"Date Paid"],["I33",65],["J33",65],["K33",62],["M33",77],["N33",76],["O33",76],["P33",76],["Q33",78],["S33",70,"Date"],["T33",79],["U33",71],["B34",80],["C34",81],["D34",81],["E34",81],["F34",81],["G34",81],["H34",81],["I34",81],["J34",81],["K34",62],["M34",77],["N34",76],["O34",76],["P34",76],["Q34",78],["B35",82],["C35",83],["D35",83],["E35",83],["F35",83],["G35",83],["H35",83],["I35",83],["J35",83],["K35",84],["M35",85],["N35",86],["O35",86],["P35",86],["Q35",87]],"merges":["N11:P11","N5:Q5","B23:E24","P29:Q29","P30:Q30","N10:P10","C27:D27","N4:Q4","V13:W13","P31:Q31","C26:D26","M27:Q28","N6:P6"]}};
const TPL = { itemized: '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', perdiem: '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' };
// pdf.js, loaded only when someone adds a PDF receipt. Pinned and integrity-checked (the legacy build,
// for older phones); the build fills in where it's served from. pdf.js 6 has no eval code path
// (CVE-2024-4367 is fixed upstream); XFA stays off.
const PDFJS = {"lib":["/assets/vendor/pdfjs-dist@6.4.299/legacy/build/pdf.min.mjs","sha384-oPqHr8MeYfJpkh4zgHbWYiuwabTzthRiOS5tSWsWGmCVWlwqIkS9coGro5aa48OF"],"worker":["/assets/vendor/pdfjs-dist@6.4.299/legacy/build/pdf.worker.min.mjs","sha384-tINN5IYq7dFaoHBUBBc2yfxGwR38mZn9GhaX31UofKYNgAg/3y8A7IjUI3GuEg/8"]};
const MAX_UPLOAD = 25 * 1024 * 1024; // per file
// Claude or web: storage, sign-in, receipt reading and downloads (src/platform-*.js)
const PLAT = window.MyExpensePlatform;
// Set per environment: by build.js for Claude (environments.json), by the server for the web version
const ENV = PLAT.env || /*__ENV__*/{ name: 'prod', title: 'MyExpense', banner: '' };

if (!window.htmPreact) {
  document.getElementById('app').innerHTML = '<div class="wrap"><div class="panel panel-b"><h2>MyExpense couldn’t load</h2><p class="muted">A required script didn’t load. Check your connection and reload the page.</p></div></div>';
  return;
}
const { html, render, useState, useEffect, useRef, useMemo } = window.htmPreact;

/* ---------- small utils ---------- */
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function b64ToBytes(b64) { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
function bytesToB64(u8) { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }
const usd = (n) => '$' + C.round2(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const cad = (n) => 'CA$' + C.round2(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const plural = (n, w, p) => n + ' ' + (n === 1 ? w : (p || w + 's'));
function rangeText(a, b) {
  if (!C.isISO(a) || !C.isISO(b)) return '';
  const ya = a.slice(0, 4), yb = b.slice(0, 4);
  return C.fmtMonD(a) + (ya !== yb ? ', ' + ya : '') + ' – ' + C.fmtMonD(b) + ', ' + yb;
}
function loadScript([src, integrity]) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    if (/\.mjs$/.test(src)) s.type = 'module';
    s.src = src; s.integrity = integrity; s.crossOrigin = 'anonymous';
    s.onload = res; s.onerror = () => rej(new Error('Couldn’t load the PDF reader. Check your connection and try again.'));
    document.head.appendChild(s);
  });
}

/* ---------- icons ---------- */
const P = {
  back: 'M15 18l-6-6 6-6', camera: 'M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  upload: 'M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3', plus: 'M12 5v14M5 12h14', trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  check: 'M5 12l5 5 9-10', alert: 'M12 8v5M12 16.5v.5M10.3 4.2L2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z',
  cloud: 'M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18z', phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3', cal: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5', x: 'M6 6l12 12M18 6L6 18',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4', lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', download: 'M12 4v12M7 11l5 5 5-5M5 20h14', sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
};
const Icon = ({ n, size }) => html`<svg class="i" viewBox="0 0 24 24" aria-hidden="true" style=${size ? 'width:' + size + 'px;height:' + size + 'px' : ''}><path d=${P[n]} /></svg>`;

/* ---------- services: the platform provides sign-in, private storage, receipt reading, downloads ---------- */
// Each person's reports and receipts live only in their own private storage, enforced on the
// server (Claude's database rules, or the MyExpense server). Nothing is kept on the device.
const bus = new Set();
const emit = () => bus.forEach(f => f());
const Svc = {
  ready: false, store: null, user: null,
  access: 'checking', // checking | ok | signin | no-access | error, plus platform-specific screens
};
async function initServices() {
  try { await PLAT.init(Svc, ENV, emit); } catch (e) { Svc.store = null; Svc.access = 'error'; }
  Svc.ready = true; emit();
}
const aiOn = () => PLAT.aiAvailable(Svc);

// A refused write or read (no access, access removed, or the session ended) drops everything held
// in memory and shows the access or sign-in screen.
function lostAccess(state) {
  for (const t of timers.values()) clearTimeout(t);
  timers.clear();
  for (const u of urlCache.values()) URL.revokeObjectURL(u);
  urlCache.clear();
  Model.reports = []; Model.settings = {}; Model.loaded = false;
  Svc.store = null; Svc.user = null; Svc.access = state || 'no-access'; emit();
}
// Returns true when the caller may retry later
function writeFailed(e, what) {
  const kind = PLAT.classify(e, what);
  if (kind === 'toolarge') { toast('This report is too large to save. Split it into two reports.'); return false; }
  if (kind === 'access') { lostAccess('no-access'); return false; }
  if (kind === 'signin') { lostAccess('signin'); return false; }
  if (kind === 'quota') { toast('MyExpense’s storage is full. Delete reports you’ve already submitted, then try again.'); return false; }
  if (kind === 'bad') { toast('That change couldn’t be saved. Reload the page and try again.'); return false; }
  return true;
}

/* ---------- model: reports kept in memory, saved as they change ---------- */
const Model = {
  reports: [], settings: {}, loaded: false, saveState: 'idle',
  get(id) { return this.reports.find(r => r.id === id); },
  set(list) { this.reports = list; emit(); },
  update(id, fn) {
    const cur = this.get(id); if (!cur) return;
    let next = fn(cur); if (!next || next === cur) return;
    next = C.reconcile(next, () => uid('c')); // the report and its statement stay in step
    next.updatedAt = Date.now();
    this.reports = this.reports.map(r => (r.id === id ? next : r));
    schedule(next.id); emit();
  },
  add(r) { this.reports = [r, ...this.reports]; schedule(r.id); emit(); },
  async remove(id) {
    const r = this.get(id); if (!r) return;
    clearTimeout(timers.get(id)); timers.delete(id);
    this.reports = this.reports.filter(x => x.id !== id); emit();
    const imgs = new Set([...(r.charges || []), ...(r.statements || [])].map(c => c.imageId).filter(Boolean));
    try { await Svc.store.deleteReport(id); for (const i of imgs) await Svc.store.deleteImage(i).catch(() => {}); }
    catch (e) { if (writeFailed(e)) toast('Couldn’t delete that report. Try again.'); }
  },
  async saveSettings(s) {
    this.settings = s; emit();
    try { await Svc.store.saveSettings(s); } catch (e) { if (writeFailed(e)) toast('Couldn’t save your details. Try again.'); }
  },
};
const timers = new Map();
const retries = new Map();
function setSave(s) { Model.saveState = s; emit(); }
function schedule(id) { clearTimeout(timers.get(id)); setSave('saving'); timers.set(id, setTimeout(() => persist(id), 600)); }
async function persist(id) {
  timers.delete(id);
  const r = Model.get(id); if (!r || !Svc.store) return;
  try { await Svc.store.saveReport(r); retries.delete(id); if (!timers.size) setSave('saved'); }
  catch (e) {
    if (!writeFailed(e, r)) { if (Svc.access === 'ok') setSave('error'); return; }
    const n = (retries.get(id) || 0) + 1; retries.set(id, n);
    setSave('retrying');
    timers.set(id, setTimeout(() => persist(id), Math.min(60000, 2000 * 2 ** n) + Math.random() * 1000));
  }
}
async function flush(id) { if (timers.has(id)) { clearTimeout(timers.get(id)); await persist(id); } }
async function loadAll() {
  try {
    const [list, s] = await Promise.all([Svc.store.listReports(), Svc.store.getSettings()]);
    Model.settings = C.cleanSettings(s);
    Model.reports = list.map(C.cleanReport).filter(Boolean).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)); // validate everything read back
    Model.loaded = true; emit();
  } catch (e) {
    const kind = PLAT.classify(e);
    if (kind === 'access' || kind === 'signin') lostAccess(kind === 'signin' ? 'signin' : 'no-access'); else { Svc.access = 'error'; emit(); }
  }
}
function useTick() { const [, set] = useState(0); useEffect(() => { const f = () => set(x => x + 1); bus.add(f); return () => bus.delete(f); }, []); }

/* ---------- toasts & confirm ---------- */
let toastList = [];
function toast(msg) { const id = uid('t'); toastList = [...toastList, { id, msg }]; emit(); setTimeout(() => { toastList = toastList.filter(t => t.id !== id); emit(); }, 4200); }
let confirmState = null;
function askConfirm(opts) { return new Promise(res => { confirmState = { ...opts, res }; emit(); }); }

/* ---------- images: compress, PDFs, thumbnails ---------- */
function canvasBlob(cv, q) { return new Promise((res, rej) => cv.toBlob(b => (b ? res(b) : rej(new Error('Could not encode image'))), 'image/jpeg', q)); }
async function decodeImage(file) {
  if (window.createImageBitmap) { try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { /* fall back */ } }
  const url = URL.createObjectURL(file);
  try { const img = new Image(); img.src = url; await img.decode(); return img; }
  finally { setTimeout(() => URL.revokeObjectURL(url), 2000); }
}
async function scaleToJpeg(src, maxSide, q) {
  const w0 = src.width, h0 = src.height;
  const k = Math.min(1, maxSide / Math.max(w0, h0));
  const cv = document.createElement('canvas'); cv.width = Math.round(w0 * k); cv.height = Math.round(h0 * k);
  const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(src, 0, 0, cv.width, cv.height);
  return { blob: await canvasBlob(cv, q), w: cv.width, h: cv.height, canvas: cv };
}
async function loadPdfJs() {
  if (window.pdfjsLib && window.pdfjsWorker) return window.pdfjsLib;
  await loadScript(PDFJS.lib);    // sets window.pdfjsLib
  await loadScript(PDFJS.worker); // sets window.pdfjsWorker, so pdf.js runs on the page itself
  if (!window.pdfjsLib || !window.pdfjsWorker) throw new Error('Couldn’t start the PDF reader. Try a photo of the receipt instead.');
  return window.pdfjsLib;
}
async function processFile(file) {
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
  if (!isPdf) {
    let src;
    try { src = await decodeImage(file); } catch (e) { throw new Error('That photo format can’t be opened here. Try a JPEG or PNG, or take a screenshot.'); }
    if (src.width * src.height > 80e6) throw new Error('That image is too large to open (over 80 megapixels).');
    const out = await scaleToJpeg(src, 1600, 0.74);
    return { blob: out.blob, w: out.w, h: out.h, aiBlobs: [out.blob] };
  }
  const lib = await loadPdfJs();
  const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), enableXfa: false, isEvalSupported: false }).promise;
  const pages = Math.min(pdf.numPages, 3);
  const canvases = [];
  for (let p = 1; p <= pages; p++) {
    const page = await pdf.getPage(p);
    const vp0 = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: 1100 / vp0.width });
    const cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
    const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    await page.render({ canvasContext: g, viewport: vp }).promise;
    canvases.push(cv);
  }
  const aiBlobs = [];
  for (const cv of canvases) aiBlobs.push(await canvasBlob(cv, 0.8));
  const W = canvases[0].width, H = canvases.reduce((a, c) => a + c.height, 0);
  const all = document.createElement('canvas'); all.width = W; all.height = H;
  const g = all.getContext('2d'); let y = 0; for (const cv of canvases) { g.drawImage(cv, 0, y); y += cv.height; }
  const out = await scaleToJpeg(all, 3000, 0.72);
  const orig = file.size <= 6 * 1024 * 1024 ? { blob: file.slice(0, file.size, 'application/pdf'), name: file.name || 'receipt.pdf', type: 'application/pdf' } : null;
  return { blob: out.blob, w: out.w, h: out.h, aiBlobs, orig };
}
const urlCache = new Map();
function useImageURL(id) {
  const [url, setUrl] = useState(urlCache.get(id) || null);
  useEffect(() => {
    let live = true;
    if (!id || !Svc.store) { setUrl(null); return; }
    if (urlCache.has(id)) { setUrl(urlCache.get(id)); return; }
    Svc.store.getImage(id).then(img => { if (img && img.blob) { const u = URL.createObjectURL(img.blob); urlCache.set(id, u); if (live) setUrl(u); } }).catch(() => {});
    return () => { live = false; };
  }, [id]);
  return url;
}

/* ---------- receipt reading with Claude ---------- */
const aiQueue = []; let aiBusy = false;
function queueAI(job) { aiQueue.push(job); pumpAI(); }
async function pumpAI() {
  if (aiBusy) return; const job = aiQueue.shift(); if (!job) return;
  aiBusy = true; try { await (job.pageId ? runStatementAI(job) : runAI(job)); } finally { aiBusy = false; pumpAI(); }
}
function patchCharge(r, cid, patch) { return { ...r, charges: r.charges.map(c => (c.id === cid ? { ...c, ...patch } : c)) }; }
function aiErrorText(e) {
  const code = e && e.code;
  if (code === 'not_granted' || code === 'ai_off') return 'Receipt reading is turned off. Fill in the details from the photo.';
  if (code === 'ai_limit') return 'You’ve reached today’s limit for receipt reading. Fill in the details from the photo.';
  if (code === 'rate_limited' || code === 'usage_limited') return 'Claude is busy right now. Fill in the details from the photo.';
  if (code === 'image_rejected') return 'Claude couldn’t open this photo. Fill in the details from it.';
  return 'Couldn’t read this receipt. Fill in the details from the photo.';
}
async function runAI({ reportId, chargeId, blobs, imageId }) {
  if (!aiOn()) { Model.update(reportId, r => patchCharge(r, chargeId, { ai: null, currency: 'CAD' })); return; }
  try {
    const raw = await PLAT.readReceipt(Svc, { blobs, imageId, today: todayISO(), prompt: C.AI_PROMPT(todayISO()) });
    const res = C.normalizeAi(raw);
    if (res.kind === 'statement') { moveToStatements(reportId, chargeId, imageId, blobs); return; }
    if (!res.transactions.length) {
      Model.update(reportId, r => patchCharge(r, chargeId, { ai: 'failed', currency: 'CAD', aiNote: res.kind === 'unreadable' ? 'Claude couldn’t make out this photo. Fill in the details, or retake it.' : 'No claimable charges found on this photo. Fill in the details if it belongs on the report.' }));
      return;
    }
    Model.update(reportId, r => {
      const at = r.charges.findIndex(c => c.id === chargeId); if (at < 0) return r;
      const base = r.charges[at];
      const made = res.transactions.map((t, k) => ({
        ...base, id: k === 0 ? chargeId : uid('c'), date: t.date, vendor: t.vendor || '', category: t.category,
        amount: t.amount, currency: t.currency, cad: t.cad, payment: t.payment || '', approved: false, ai: 'read', checked: false, aiNote: t.note || '',
      }));
      const charges = r.charges.slice(); charges.splice(at, 1, ...made);
      return { ...r, charges };
    });
  } catch (e) {
    if (PLAT.aiFailed(Svc, e)) emit();
    if (PLAT.classify(e) === 'signin') { lostAccess('signin'); return; }
    Model.update(reportId, r => patchCharge(r, chargeId, { ai: 'failed', currency: 'CAD', aiNote: aiErrorText(e) }));
  }
}
/* ---------- bank statements ---------- */
function patchPage(r, pid, fn) { return { ...r, statements: (r.statements || []).map(p => (p.id === pid ? fn(p) : p)) }; }
function patchRow(r, pid, rid, patch) { return patchPage(r, pid, p => ({ ...p, rows: p.rows.map(x => (x.id === rid ? { ...x, ...patch } : x)) })); }
// A card statement added with the receipts moves to its own section (its ticked charges go on the
// report from there, like any statement's).
function moveToStatements(reportId, chargeId, imageId, blobs) {
  const pageId = uid('p');
  Model.update(reportId, r => {
    const c = r.charges.find(x => x.id === chargeId); if (!c) return r;
    return { ...r, charges: r.charges.filter(x => x.id !== chargeId),
      statements: [...(r.statements || []), { id: pageId, imageId, name: 'Card statement', w: 0, h: 0, card: '', ai: 'reading', aiNote: '', rows: [] }] };
  });
  toast('That looks like a card statement, so it’s under Bank statement now.');
  Svc.store.getImage(imageId).then(img => { if (img) Model.update(reportId, r => patchPage(r, pageId, p => ({ ...p, w: img.w, h: img.h }))); }).catch(() => {});
  queueAI({ reportId, pageId, blobs, imageId });
}
async function runStatementAI({ reportId, pageId, blobs, imageId }) {
  const set = (fn) => Model.update(reportId, r => patchPage(r, pageId, fn));
  if (!aiOn()) { set(p => ({ ...p, ai: null })); return; }
  try {
    const raw = await PLAT.readReceipt(Svc, { blobs, imageId, kind: 'statement', today: todayISO(), prompt: C.STATEMENT_PROMPT(todayISO()) });
    const res = C.normalizeStatement(raw);
    const rows = res.rows.map(x => ({ ...x, id: uid('s'), chargeId: null, source: 'ai' }));
    const note = res.kind === 'not_statement' ? 'This doesn’t look like a card statement. Tick and add the charges yourself, or remove the page.'
      : !rows.length ? 'Claude couldn’t find any charges on this page. Add them yourself, or retake the photo.' : '';
    set(p => ({ ...p, ai: rows.length ? 'read' : 'failed', aiNote: note, card: res.card || p.card, rows }));
  } catch (e) {
    if (PLAT.aiFailed(Svc, e)) emit();
    if (PLAT.classify(e) === 'signin') { lostAccess('signin'); return; }
    set(p => ({ ...p, ai: 'failed', aiNote: aiErrorText(e).replace('this receipt', 'this statement page').replace('Fill in the details from the photo.', 'Tick and add the charges yourself.') }));
  }
}
// Statement pages are kept sharper than receipts, so small print stays readable
async function processStatementFile(file) {
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
  const name = String(file.name || 'Statement').replace(/\.[a-z0-9]{2,5}$/i, '').slice(0, 60);
  if (!isPdf) {
    let src;
    try { src = await decodeImage(file); } catch (e) { throw new Error('That picture can’t be opened here. Try a JPEG or PNG screenshot.'); }
    if (src.width * src.height > 80e6) throw new Error('That image is too large to open (over 80 megapixels).');
    const out = await scaleToJpeg(src, 2400, 0.82);
    return { pages: [{ blob: out.blob, w: out.w, h: out.h, name }], orig: null };
  }
  const lib = await loadPdfJs();
  const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), enableXfa: false, isEvalSupported: false }).promise;
  const n = Math.min(pdf.numPages, 12);
  if (pdf.numPages > 12) toast('Only the first 12 pages of ' + (file.name || 'that PDF') + ' were added.');
  const pages = [];
  for (let k = 1; k <= n; k++) {
    const page = await pdf.getPage(k);
    const vp0 = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: 1700 / vp0.width });
    const cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
    const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    await page.render({ canvasContext: g, viewport: vp }).promise;
    pages.push({ blob: await canvasBlob(cv, 0.82), w: cv.width, h: cv.height, name: name + (n > 1 ? ' p' + k : '') });
  }
  // The PDF itself is kept too (up to 6 MB), so the statement exports exactly as it was uploaded
  const orig = file.size <= 6 * 1024 * 1024 ? { blob: file.slice(0, file.size, 'application/pdf'), name: file.name || 'statement.pdf', type: 'application/pdf' } : null;
  return { pages, orig };
}
async function addStatementFiles(reportId, files) {
  const tooBig = [...files].filter(f => f.size > MAX_UPLOAD);
  if (tooBig.length) toast(tooBig.map(f => f.name || 'A file').join(', ') + ' is over 25 MB, so it was skipped.');
  const list = (await expandFiles([...files].filter(f => f.size <= MAX_UPLOAD))).filter(f => /^image\//.test(f.type) || f.type === 'application/pdf' || /\.(pdf|jpe?g|png|heic|webp)$/i.test(f.name || ''));
  if (!list.length) { toast('Choose a screenshot, photo, PDF or Word file of your statement.'); return; }
  for (const file of list) {
    const holder = uid('p');
    Model.update(reportId, r => ({ ...r, statements: [...(r.statements || []), { id: holder, imageId: null, name: String(file.name || 'Statement').slice(0, 60), w: 0, h: 0, card: '', ai: 'processing', aiNote: '', rows: [] }] }));
    try {
      const { pages, orig } = await processStatementFile(file);
      if (!Svc.store) return;
      const made = [];
      for (const pg of pages) {
        const imageId = uid('i');
        const withOrig = !made.length && orig;
        try { await Svc.store.putImage(imageId, pg.blob, { w: pg.w, h: pg.h }, withOrig ? orig : null); }
        catch (e) { writeFailed(e); if (Svc.access !== 'ok') return; throw new Error('Couldn’t save the statement page. Check your connection and add it again.'); }
        made.push({ ...pg, imageId, id: made.length ? uid('p') : holder, orig: !!withOrig });
      }
      const reading = aiOn();
      Model.update(reportId, r => {
        const at = (r.statements || []).findIndex(p => p.id === holder); if (at < 0) return r;
        const st = r.statements.slice();
        st.splice(at, 1, ...made.map(m => ({ id: m.id, group: holder, orig: m.orig, imageId: m.imageId, name: m.name, w: m.w, h: m.h, card: '', ai: reading ? 'reading' : null, aiNote: '', rows: [] })));
        return { ...r, statements: st };
      });
      if (reading) for (const m of made) queueAI({ reportId, pageId: m.id, blobs: [m.blob], imageId: m.imageId });
    } catch (e) {
      Model.update(reportId, r => patchPage(r, holder, p => ({ ...p, ai: 'failed', aiNote: (e && e.message) || 'Couldn’t add that file.' })));
    }
  }
}
// The statements as uploaded: each PDF as it was, and each screenshot or photo as a picture
async function statementFiles(r) {
  const files = [], done = new Set();
  for (const p of r.statements || []) {
    if (!p.imageId || done.has(p.group || p.id)) continue;
    const o = p.orig && Svc.store.getOriginal ? await Svc.store.getOriginal(p.imageId).catch(() => null) : null;
    if (o && o.blob) { files.push({ blob: o.blob, ext: 'pdf', name: p.name.replace(/ p1$/, '') }); done.add(p.group || p.id); continue; }
    const img = await Svc.store.getImage(p.imageId).catch(() => null);
    if (img && img.blob) files.push({ blob: img.blob, ext: 'jpg', name: p.name });
  }
  return files.map((f, i) => ({ ...f, name: C.safeName('Statement ' + String(i + 1).padStart(2, '0') + (f.name ? ' - ' + f.name : '')) }));
}
async function exportStatementFiles(r) {
  const files = await statementFiles(r);
  if (!files.length) { toast('There are no statement pages on this report.'); return false; }
  const zip = new window.JSZip();
  for (const f of files) zip.file(f.name + '.' + f.ext, f.blob);
  return saveFile(C.fileBase(r) + ' Bank Statement files.zip', await zip.generateAsync({ type: 'blob' }));
}
async function downloadStatementPage(p, original) {
  if (original) {
    const o = await Svc.store.getOriginal(p.imageId).catch(() => null);
    if (o && o.blob) return saveFile(C.safeName(p.name.replace(/ p1$/, '') || 'Statement') + '.pdf', o.blob);
  }
  const img = await Svc.store.getImage(p.imageId).catch(() => null);
  if (!img || !img.blob) { toast('Couldn’t load that page.'); return false; }
  return saveFile(C.safeName(p.name || 'Statement page') + '.jpg', img.blob);
}
// A receipt for a charge that has none (for example one that came from the statement)
async function attachReceiptFile(reportId, chargeId, file) {
  if (file.size > MAX_UPLOAD) { toast((file.name || 'That file') + ' is over 25 MB.'); return; }
  try {
    const img = await processFile(file);
    const imageId = uid('i');
    try { await Svc.store.putImage(imageId, img.blob, { w: img.w, h: img.h }, img.orig); }
    catch (e) { writeFailed(e); if (Svc.access !== 'ok') return; throw new Error('Couldn’t save the receipt. Check your connection and try again.'); }
    Model.update(reportId, r => patchCharge(r, chargeId, { imageId }));
    toast('Receipt attached.');
  } catch (e) { toast((e && e.message) || 'Couldn’t attach that receipt.'); }
}
async function exportStatementPdf(r) {
  const pages = [];
  for (const p of r.statements || []) {
    const img = p.imageId ? await Svc.store.getImage(p.imageId).catch(() => null) : null;
    pages.push({ data: img && img.blob ? new Uint8Array(await img.blob.arrayBuffer()) : null, w: (img && img.w) || p.w || 1, h: (img && img.h) || p.h || 1, label: p.name });
  }
  if (!pages.length) { toast('There are no statement pages on this report.'); return false; }
  const items = C.statementList(r);
  const missing = C.statementCheck(r).missing.map(c => (c.date ? C.fmtNice(c.date) : 'Undated') + ' · ' + (C.CAT[c.category] ? C.CAT[c.category].label : 'Charge') + (c.vendor ? ' · ' + c.vendor : '') + (C.chargeCAD(c) !== null ? ' · ' + cad(C.chargeCAD(c)) : ''));
  const s = C.itemizedSummary(r);
  const cards = [...new Set((r.statements || []).map(p => p.card).filter(Boolean))];
  const sub = [(r.customer || 'Untitled') + ' itemized expenses' + (s.first ? ' · ' + rangeText(s.first, s.last) : ''), 'Employee: ' + (r.name || '—')];
  if (cards.length) sub.push('Card: ' + cards.join(', '));
  const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter', compress: true });
  doc.setProperties({ title: C.fileBase(r) + ' Bank Statement', author: r.name || '', creator: ENV.title });
  C.pdfStatement(doc, { heading: (r.customer || '') + ' · ' + (r.name || '') + ' · bank statement', sub, items, missing, pages, fresh: true });
  return saveFile(C.fileBase(r) + ' Bank Statement.pdf', doc.output('blob'));
}

const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
async function expandFiles(files) {
  const out = [];
  for (const f of files) {
    if (f.type === DOCX || /\.docx$/i.test(f.name || '')) {
      try {
        const z = await window.JSZip.loadAsync(await f.arrayBuffer());
        const media = Object.keys(z.files).filter(p => /^word\/media\/[^/]+\.(png|jpe?g|gif|bmp|webp)$/i.test(p))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        if (!media.length) { toast(f.name + ' has no pictures in it.'); continue; }
        for (const p of media) {
          const ext = p.split('.').pop().toLowerCase();
          const b = await z.file(p).async('blob');
          out.push(new File([b], (f.name || 'document').replace(/\.docx$/i, '') + ' - ' + p.split('/').pop(), { type: 'image/' + (ext === 'jpg' ? 'jpeg' : ext) }));
        }
      } catch (e) { toast('Couldn’t open ' + (f.name || 'that document') + '.'); }
    } else out.push(f);
  }
  return out;
}
async function addFiles(reportId, files) {
  const tooBig = [...files].filter(f => f.size > MAX_UPLOAD);
  if (tooBig.length) toast(tooBig.map(f => f.name || 'A file').join(', ') + ' is over 25 MB, so it was skipped.');
  const list = (await expandFiles([...files].filter(f => f.size <= MAX_UPLOAD))).filter(f => /^image\//.test(f.type) || f.type === 'application/pdf' || /\.(pdf|jpe?g|png|heic|webp)$/i.test(f.name || ''));
  if (!list.length) { toast('Choose a photo, PDF or Word file with the receipts.'); return; }
  for (const file of list) {
    const cid = uid('c');
    Model.update(reportId, r => ({ ...r, charges: [...r.charges, { id: cid, date: null, vendor: '', category: '', amount: null, currency: null, cad: null, approved: false, imageId: null, ai: 'processing', checked: false }] }));
    try {
      const img = await processFile(file);
      const imageId = uid('i');
      if (!Svc.store) return;
      try { await Svc.store.putImage(imageId, img.blob, { w: img.w, h: img.h }, img.orig); }
      catch (e) { writeFailed(e); if (Svc.access !== 'ok') return; throw new Error('Couldn’t save the photo. Check your connection and add it again.'); }
      const reading = aiOn();
      Model.update(reportId, r => patchCharge(r, cid, { imageId, ai: reading ? 'reading' : null, currency: reading ? null : 'CAD' }));
      if (reading) queueAI({ reportId, chargeId: cid, blobs: img.aiBlobs, imageId });
    } catch (e) {
      Model.update(reportId, r => patchCharge(r, cid, { ai: 'failed', currency: 'CAD', aiNote: (e && e.message) || 'Couldn’t add that file.' }));
    }
  }
}

/* ---------- downloads & exports ---------- */
function saveFile(filename, blob) { return PLAT.saveFile(Svc, filename, blob, toast); }
async function exportXlsx(r) {
  const tpl = b64ToBytes(r.type === 'perdiem' ? TPL.perdiem : TPL.itemized);
  const res = r.type === 'perdiem' ? await C.perDiemXlsx(window.JSZip, tpl, r) : await C.itemizedXlsx(window.JSZip, tpl, r);
  return saveFile(C.fileBase(r) + '.xlsx', new Blob([res.bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
}
async function exportPdf(r) {
  const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter', compress: true });
  doc.setProperties({ title: C.fileBase(r), author: r.name || '', creator: ENV.title });
  if (r.type === 'perdiem') {
    const weeks = C.perDiemWeeks(r);
    C.pdfForms(doc, LAYOUTS.perdiem, weeks.map(w => ({ title: w.title, values: C.perDiemCells(r, w) })));
  } else {
    const s = C.itemizedSummary(r);
    C.pdfForms(doc, LAYOUTS.itemized, s.weeks.map(w => ({ title: w.title, values: C.itemizedCells(r, w) })));
  }
  return saveFile(C.fileBase(r) + '.pdf', doc.output('blob'));
}
// Receipts for the charges on the report, numbered in date order (same numbers in the PDF and the zip)
async function exportReceiptsPdf(r) {
  const recs = [];
  for (const x of C.receiptList(r)) {
    const img = await Svc.store.getImage(x.imageId).catch(() => null);
    recs.push({ no: x.no, data: img && img.blob ? new Uint8Array(await img.blob.arrayBuffer()) : null, w: img ? img.w : 1, h: img ? img.h : 1, lines: x.lines });
  }
  if (!recs.length) { toast('There are no receipt photos on this report.'); return false; }
  const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter', compress: true });
  doc.setProperties({ title: C.fileBase(r) + ' Receipts', author: r.name || '', creator: ENV.title });
  C.pdfReceipts(doc, recs, (r.customer || '') + ' · ' + (r.name || '') + ' · receipts', true);
  return saveFile(C.fileBase(r) + ' Receipts.pdf', doc.output('blob'));
}
function extFor(orig) { if (orig.type === 'application/pdf') return 'pdf'; const m = /\.([a-z0-9]{2,5})$/i.exec(orig.name || ''); return m ? m[1].toLowerCase() : 'bin'; }
async function receiptFile(imageId) {
  const orig = Svc.store.getOriginal ? await Svc.store.getOriginal(imageId).catch(() => null) : null;
  if (orig && orig.blob) return { blob: orig.blob, ext: extFor(orig) };
  const img = await Svc.store.getImage(imageId).catch(() => null);
  return img && img.blob ? { blob: img.blob, ext: 'jpg' } : null;
}
async function exportReceiptsZip(r) {
  const zip = new window.JSZip();
  let n = 0;
  for (const x of C.receiptList(r)) {
    const f = await receiptFile(x.imageId);
    if (f) { zip.file(x.name + '.' + f.ext, f.blob); n++; }
  }
  if (!n) { toast('There are no receipt photos on this report.'); return false; }
  return saveFile(C.fileBase(r) + ' Receipts.zip', await zip.generateAsync({ type: 'blob', compression: 'STORE' }));
}
async function downloadReceipt(c) {
  const f = await receiptFile(c.imageId);
  if (!f) { toast('That receipt photo couldn’t be loaded.'); return false; }
  const cat = C.CAT[c.category];
  const name = C.safeName((C.isISO(c.date) ? c.date + ' ' : '') + (cat ? (cat.short || cat.label) : 'Receipt') + (c.vendor ? ' - ' + c.vendor : '')) || 'Receipt';
  return saveFile(name + '.' + f.ext, f.blob);
}

/* ---------- report helpers ---------- */
function newReport(type) {
  const base = { id: uid('r'), type, name: Model.settings.name || '', customer: '', createdAt: Date.now(), updatedAt: Date.now() };
  if (type === 'perdiem') return { ...base, start: '', end: '', partialMode: null, partialDays: [] };
  return { ...base, manager: Model.settings.manager || '', location: '', charges: [], statements: [] };
}
function isBlank(r) { return r.type === 'perdiem' ? !r.customer && !r.start && !r.end : !r.customer && !(r.charges || []).length && !(r.statements || []).length; }
function reportStatus(r) {
  if (r.type === 'perdiem') {
    const p = C.perDiemProblems(r); const s = C.perDiemSummary(r);
    return { total: s.total, cur: 'USD', range: rangeText(r.start, r.end), meta: s.weeks.length ? plural(s.weeks.length, 'week') + ' · ' + plural(s.fullDays + s.partialDays, 'day') : 'No dates yet', problems: p };
  }
  const s = C.itemizedSummary(r); const p = C.itemizedProblems(r);
  const pending = (r.charges || []).filter(c => c.ai === 'read' && !c.checked).length;
  return { total: s.total, cur: 'CAD', range: s.first ? rangeText(s.first, s.last) : '', meta: plural((r.charges || []).length, 'charge') + (s.weeks.length ? ' · ' + plural(s.weeks.length, 'week') : ''), problems: p, left: s.left.length, pending };
}

/* ---------- components ---------- */
function EnvBand() {
  return ENV.banner ? html`<div class="envband" role="note">${ENV.banner}</div>` : null;
}
function StorePill() {
  if (Svc.access !== 'ok') return null;
  return html`<span class="store-pill"><${Icon} n=${WORDS.pillIcon} size=${16} />${WORDS.pill}</span>`;
}
function SaveState() {
  const s = Model.saveState;
  if (s === 'saving') return html`<span>Saving…</span>`;
  if (s === 'retrying') return html`<span style="color:var(--warn)">Not saved yet. Retrying…</span>`;
  if (s === 'error') return html`<span style="color:var(--bad)">Not saved</span>`;
  if (s === 'saved') return html`<span>${WORDS.saved}</span>`;
  return null;
}

function Home({ open, openSettings }) {
  const reps = Model.reports;
  const name = Model.settings.name;
  return html`
  <div class="wrap">
    <div class="section-h">
      <div style="display:grid;gap:4px">
        <h1>${name ? 'Expense reports for ' + name.split(' ')[0] : 'Expense reports'}</h1>
        <${StorePill} />
      </div>
      <button class="btn sm" onClick=${openSettings}><${Icon} n="user" size=${18} />${name ? 'Your details' : 'Add your name'}</button>
    </div>
    <div class="start">
      <button class="start-card" onClick=${() => open(newReport('perdiem'), true)}>
        <div class="row"><span class="tag pd">Per diem</span><${Icon} n="cal" /></div>
        <div class="big">New per diem report</div>
        <p class="muted small">US trip at $100 a day, $50 for partial days. Pick the dates; it splits into Sunday–Saturday weeks for you.</p>
      </button>
      <button class="start-card" onClick=${() => open(newReport('itemized'), true)}>
        <div class="row"><span class="tag it">Itemized</span><${Icon} n="receipt" /></div>
        <div class="big">New itemized report</div>
        <p class="muted small">Snap your Uber, rental, baggage and fuel receipts. Each charge lands on its day in the right week.</p>
      </button>
    </div>
    <div class="section-h"><h2>Your reports</h2>${Model.loaded && reps.length > 0 && html`<span class="muted small">${plural(reps.length, 'report')}</span>`}</div>
    ${!Model.loaded ? html`<div class="list"><div class="skel"></div><div class="skel"></div></div>`
      : reps.length === 0 ? html`<div class="empty"><${Icon} n="receipt" size=${28} /><b style="color:var(--ink)">No reports yet</b><p class="small">${WORDS.empty}</p></div>`
      : html`<div class="list">${reps.map(r => html`<${ReportCard} key=${r.id} r=${r} onOpen=${() => open(r)} />`)}</div>`}
  </div>`;
}
function ReportCard({ r, onOpen }) {
  const st = reportStatus(r);
  let chip;
  if (r.type === 'itemized' && (r.charges || []).some(c => c.ai === 'reading' || c.ai === 'processing')) chip = html`<span class="chip info"><span class="spin"></span>Reading receipts</span>`;
  else if (st.problems.length) chip = html`<span class="chip warn"><span class="dot"></span>${st.problems.length === 1 ? st.problems[0].msg.replace(/\.$/, '') : st.problems.length + ' things to finish'}</span>`;
  else if (st.pending) chip = html`<span class="chip warn"><span class="dot"></span>${plural(st.pending, 'charge')} to check</span>`;
  else chip = html`<span class="chip ok"><${Icon} n="check" size=${14} />Ready to download</span>`;
  return html`<button class="rcard" onClick=${onOpen}>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class=${'tag ' + (r.type === 'perdiem' ? 'pd' : 'it')}>${r.type === 'perdiem' ? 'Per diem' : 'Itemized'}</span><span class="meta">${st.range}</span></div>
    <div class="total">${st.cur === 'USD' ? usd(st.total) : cad(st.total)}<div class="faint small" style="font-family:var(--f-body)">${st.cur}</div></div>
    <div class="cust">${r.customer || html`<span class="faint">Untitled ${r.type === 'perdiem' ? 'per diem' : 'itemized'} report</span>`}</div>
    <div></div>
    <div class="meta">${st.meta}</div>
    <div class="status">${chip}</div>
  </button>`;
}

function Field({ id, label, hint, children }) {
  return html`<div class="field"><label for=${id}>${label}</label>${children}${hint && html`<span class="hint">${hint}</span>`}</div>`;
}
function TextInput({ id, value, onValue, placeholder, bad, autocomplete, type, max }) {
  return html`<input id=${id} class=${'inp' + (bad ? ' bad' : '')} type=${type || 'text'} value=${value || ''} maxlength=${max || 80} placeholder=${placeholder || ''} autocomplete=${autocomplete || 'off'} onInput=${e => onValue(e.target.value)} />`;
}
function MoneyInput({ id, value, onValue, bad, placeholder }) {
  const [txt, setTxt] = useState(value === null || value === undefined || value === '' ? '' : String(value));
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setTxt(value === null || value === undefined || value === '' ? '' : String(value)); }, [value]);
  return html`<input id=${id} class=${'inp money' + (bad ? ' bad' : '')} inputmode="decimal" value=${txt} placeholder=${placeholder || '0.00'}
    onFocus=${() => { focused.current = true; }} onBlur=${() => { focused.current = false; const n = parseFloat(String(txt).replace(/[$,\s]/g, '')); setTxt(isFinite(n) ? n.toFixed(2) : ''); }}
    onInput=${e => { const t = e.target.value; setTxt(t); const n = parseFloat(t.replace(/[$,\s]/g, '')); onValue(t.trim() === '' ? null : isFinite(n) ? C.round2(n) : null); }} />`;
}
function rememberName(v) {
  if (v && v.trim().length > 3 && !Model.settings.name) Model.settings = { ...Model.settings, name: v.trim() };
}

/* ---- Per diem editor ---- */
function PerDiemEditor({ r }) {
  const set = (patch) => Model.update(r.id, x => ({ ...x, ...patch }));
  const problems = C.perDiemProblems(r);
  const bad = (f) => problems.some(p => p.field === f);
  const weeks = C.perDiemWeeks(r);
  const sum = C.perDiemSummary(r);
  const partial = new Set(r.partialMode === 'some' ? r.partialDays : []);
  function toggle(d) {
    const cur = new Set(r.partialMode === 'some' ? r.partialDays : []);
    cur.has(d) ? cur.delete(d) : cur.add(d);
    set({ partialMode: 'some', partialDays: [...cur].sort() });
  }
  const tooLong = bad('end') && C.isISO(r.start) && C.isISO(r.end) && C.parse(r.end) >= C.parse(r.start);
  return html`
  <div class="wrap">
    <section class="panel">
      <div class="panel-h"><h2>Trip</h2></div>
      <div class="panel-b">
        <div class="fields">
          <${Field} id="pd-name" label="Employee full name"><${TextInput} id="pd-name" value=${r.name} bad=${!r.name && r.customer} autocomplete="name" placeholder="First and last name" onValue=${v => { set({ name: v }); rememberName(v); }} /><//>
          <${Field} id="pd-cust" label="Customer"><${TextInput} id="pd-cust" value=${r.customer} placeholder="e.g. NBC Universal" onValue=${v => set({ customer: v })} /><//>
          <${Field} id="pd-start" label="Trip start"><input id="pd-start" class="inp" type="date" value=${r.start} onChange=${e => set({ start: e.target.value, ...(r.end && e.target.value > r.end ? { end: e.target.value } : {}) })} /><//>
          <${Field} id="pd-end" label="Trip end"><input id="pd-end" class=${'inp' + (bad('end') && r.end ? ' bad' : '')} type="date" min=${r.start || ''} value=${r.end} onChange=${e => set({ end: e.target.value })} /><//>
        </div>
        ${tooLong && html`<p class="small" style="color:var(--bad)">${problems.find(p => p.field === 'end').msg}</p>`}
        <div class="terms">
          <span>Destination <b>United States</b></span><span>Currency <b>USD</b></span><span>Full day <b>$100</b></span><span>Partial day <b>$50</b></span><span>Department <b>Customer Service</b></span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-h"><h2>Partial days</h2><span class="muted small">Paid at 50%. Only the days you mark count as partial.</span></div>
      <div class="panel-b">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <div class="seg" role="group" aria-label="Any partial days?">
            <button aria-pressed=${r.partialMode === 'none'} onClick=${() => set({ partialMode: 'none', partialDays: [] })}>None</button>
            <button aria-pressed=${r.partialMode === 'some'} onClick=${() => set({ partialMode: 'some' })}>Mark partial days</button>
          </div>
          ${r.partialMode === null && weeks.length > 0 && html`<span class="chip warn"><span class="dot"></span>Choose one to finish</span>`}
          ${r.partialMode === 'some' && html`<span class="muted small">${partial.size ? plural([...partial].filter(d => weeks.some(w => w.days.some(x => x.date === d))).length, 'partial day') + ' marked' : 'Tap each partial day below'}</span>`}
        </div>
        ${weeks.length === 0
          ? html`<div class="empty"><${Icon} n="cal" size=${26} /><p class="small">Pick the trip start and end dates. The days appear here, split into the Sunday–Saturday weeks used on the form.</p></div>`
          : html`<div class="legend"><span><i class="sw full"></i>Full day · $100</span><span><i class="sw partial"></i>Partial day · $50</span></div>
            <div style="display:grid;gap:10px">${weeks.map(w => html`<${PdWeek} key=${w.weekEnding} w=${w} partial=${partial} onToggle=${toggle} />`)}</div>`}
      </div>
    </section>

    ${weeks.length > 0 && html`<section class="panel">
      <div class="panel-h"><h2>Totals</h2></div>
      <div class="panel-b">
        <div class="math">
          ${weeks.map(w => html`<div class="row"><span>${w.title}</span><span>${usd(w.total)}</span></div>`)}
          <div class="row faint" style="margin-top:4px"><span>${sum.fullDays} full × $100 + ${sum.partialDays} partial × $50</span></div>
          <div class="row tot"><span>Grand total (USD)</span><span>${usd(sum.total)}</span></div>
        </div>
      </div>
    </section>`}
  </div>`;
}
function PdWeek({ w, partial, onToggle }) {
  const sun = C.sundayOf(w.weekEnding);
  const inTrip = new Map(w.days.map(d => [d.date, d]));
  return html`<div class="week">
    <div class="week-tab"><span class="caps">Week ending</span><span class="we">${C.fmtDDMonYY(w.weekEnding)}</span><span class="sum">${usd(w.total)}</span></div>
    <div class="cal">
      ${C.DOW3.map(d => html`<div class="dh" aria-hidden="true">${d.slice(0, 1)}</div>`)}
      ${Array.from({ length: 7 }, (_, i) => {
        const d = C.addDays(sun, i); const day = inTrip.get(d);
        if (!day) return html`<div class="day off" aria-hidden="true"></div>`;
        const p = partial.has(d);
        return html`<button class=${'day ' + (p ? 'partial' : 'full')} aria-pressed=${p} aria-label=${C.fmtNice(d) + (p ? ', partial day, $50' : ', full day, $100')} onClick=${() => onToggle(d)}>
          <span class="dm">${C.MON[Number(d.slice(5, 7)) - 1]}</span><span class="dn">${Number(d.slice(8))}</span><span class="amt">${p ? '$50' : '$100'}</span>
        </button>`;
      })}
    </div>
  </div>`;
}

/* ---- Itemized editor ---- */
const CURRENCIES = ['CAD', 'USD', 'EUR', 'GBP', 'MXN', 'JPY', 'AUD', 'INR'];
function ItemizedEditor({ r }) {
  const set = (patch) => Model.update(r.id, x => ({ ...x, ...patch }));
  const [openId, setOpenId] = useState(null);
  const [drag, setDrag] = useState(false);
  const [viewer, setViewer] = useState(null);
  const camRef = useRef(null), upRef = useRef(null);
  const sum = C.itemizedSummary(r);
  const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    const onPaste = (e) => {
      const files = [...(e.clipboardData && e.clipboardData.files || [])];
      if (files.length) { e.preventDefault(); addFiles(r.id, files); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [r.id]);

  function addManual() {
    const id = uid('c');
    Model.update(r.id, x => ({ ...x, charges: [...x.charges, { id, date: todayISO(), vendor: '', category: 'taxi', amount: null, currency: 'CAD', cad: null, approved: false, imageId: null, ai: null, checked: true }] }));
    setOpenId(id);
  }
  const unplaced = r.charges.filter(c => !C.isISO(c.date) || c.ai === 'processing' || c.ai === 'reading');
  const placed = r.charges.filter(c => !unplaced.includes(c));
  const byWeek = new Map();
  for (const c of placed.slice().sort((a, b) => a.date.localeCompare(b.date))) {
    const sat = C.saturdayOf(c.date); if (!byWeek.has(sat)) byWeek.set(sat, []); byWeek.get(sat).push(c);
  }
  const weekTotal = (sat) => (sum.weeks.find(w => w.weekEnding === sat) || { total: 0 }).total;
  const chk = (r.statements || []).length ? C.statementCheck(r) : null;
  const missingR = C.missingReceipts(r);
  const onSt = (c) => !chk ? null : chk.onStatement.has(c.id) ? (chk.onStatement.get(c.id).mismatch ? { state: 'mismatch', amount: chk.onStatement.get(c.id).row.amount } : { state: 'on' }) : chk.ready && c.ai !== 'reading' && c.ai !== 'processing' ? { state: 'missing' } : null;
  const row = (c) => html`<${ChargeItem} key=${c.id} c=${c} st=${onSt(c)} open=${openId === c.id} onToggle=${() => setOpenId(openId === c.id ? null : c.id)} reportId=${r.id} onView=${() => setViewer(c)} />`;

  return html`
  <div class="wrap">
    <section class="panel">
      <div class="panel-h"><h2>Report details</h2></div>
      <div class="panel-b">
        <div class="fields">
          <${Field} id="it-name" label="Employee full name"><${TextInput} id="it-name" value=${r.name} autocomplete="name" placeholder="First and last name" onValue=${v => { set({ name: v }); rememberName(v); }} /><//>
          <${Field} id="it-cust" label="Customer / trip" hint="Printed in the Customer row on days with charges, and used in the file name"><${TextInput} id="it-cust" value=${r.customer} placeholder="e.g. WBD LA" onValue=${v => set({ customer: v })} /><//>
          <${Field} id="it-mgr" label="Manager name"><${TextInput} id="it-mgr" value=${r.manager} placeholder="Manager’s first and last name" onValue=${v => { set({ manager: v }); }} /><//>
          <${Field} id="it-loc" label="Location (optional)" hint="Printed in the Location row on days with charges"><${TextInput} id="it-loc" value=${r.location} placeholder="e.g. Burbank, CA" onValue=${v => set({ location: v })} /><//>
        </div>
        <p class="muted small">Department: <b>Customer Service</b> · Amounts are the Canadian dollars that posted to your card.</p>
      </div>
    </section>

    <section class=${'capture' + (drag ? ' drag' : '')}
      onDragOver=${e => { e.preventDefault(); setDrag(true); }} onDragLeave=${() => setDrag(false)}
      onDrop=${e => { e.preventDefault(); setDrag(false); if (e.dataTransfer && e.dataTransfer.files.length) addFiles(r.id, e.dataTransfer.files); }}>
      <div class="capture-btns">
        ${touch && html`<button class="btn primary" onClick=${() => camRef.current && camRef.current.click()}><${Icon} n="camera" />Take photo</button>`}
        <button class=${'btn' + (touch ? '' : ' primary')} onClick=${() => upRef.current && upRef.current.click()}><${Icon} n="upload" />${touch ? 'Choose photos' : 'Upload receipts'}</button>
        <button class="btn" onClick=${addManual}><${Icon} n="plus" />Add without receipt</button>
      </div>
      <input ref=${camRef} id="it-cam" class="vh" type="file" accept="image/*" capture="environment" onChange=${e => { if (e.target.files.length) addFiles(r.id, e.target.files); e.target.value = ''; }} />
      <input ref=${upRef} id="it-up" class="vh" type="file" accept="image/*,application/pdf,.docx" multiple onChange=${e => { if (e.target.files.length) addFiles(r.id, e.target.files); e.target.value = ''; }} />
      <p class="note">${aiOn()
        ? html`<${Icon} n="sparkle" size=${14} /> Claude reads each receipt and fills in the charge for you to check. Photos, PDFs, Word files with pictures and pasted screenshots all work. Card statements go under Bank statement, below.`
        : 'Each photo becomes a charge with the receipt attached. Fill in the date, type and amount from it. Photos, PDFs, Word files with pictures and pasted screenshots all work. Card statements go under Bank statement, below.'}</p>
    </section>

    ${r.charges.length === 0 && html`<div class="empty"><${Icon} n="receipt" size=${28} /><b style="color:var(--ink)">No charges yet</b><p class="small">Usually claimed: Uber and taxi rides, vehicle rentals, airline baggage fees and fuel. Parking goes on only when you OK it.</p></div>`}

    ${unplaced.length > 0 && html`<div class="week">
      <div class="week-tab"><span class="caps">Needs a date</span><span class="sum faint" style="font-family:var(--f-body);font-weight:400">${plural(unplaced.length, 'charge')}</span></div>
      <div class="charges">${unplaced.map(row)}</div>
    </div>`}

    ${[...byWeek.keys()].sort().map(sat => html`<div class="week" key=${sat}>
      <div class="week-tab"><span class="caps">Week ending</span><span class="we">${C.fmtDDMonYY(sat)}</span><span class="sum">${cad(weekTotal(sat))}</span></div>
      <div class="charges">${byWeek.get(sat).map(row)}</div>
    </div>`)}

    <${StatementSection} r=${r} />

    ${r.charges.length > 0 && html`<section class="panel">
      <div class="panel-h"><h2>Totals</h2><span class="muted small">CAD</span></div>
      <div class="panel-b">
        <div class="math">
          ${sum.weeks.map(w => html`<div class="row"><span>${w.title}</span><span>${cad(w.total)}</span></div>`)}
          ${sum.weeks.length === 0 && html`<div class="row faint"><span>No complete charges yet</span><span>${cad(0)}</span></div>`}
          <div class="row tot"><span>Grand total</span><span>${cad(sum.total)}</span></div>
        </div>
        ${missingR.length > 0 && html`<div class="left-off"><b class="small" style="color:var(--warn)">Missing receipts</b><ul class="plain small">${missingR.map(c => html`<li key=${c.id}><button class="linkbtn" onClick=${() => { setOpenId(c.id); setTimeout(() => { const el = document.querySelector('[aria-expanded="true"]'); if (el) el.scrollIntoView({ block: 'center' }); }, 50); }}>${label(c)}${C.chargeCAD(c) !== null ? ' · ' + cad(C.chargeCAD(c)) : ''}</button></li>`)}</ul><span class="small muted">These charges are on the report without a receipt. Attach one to each if you have it.</span></div>`}
        ${sum.left.length > 0 && html`<div class="left-off"><b class="small" style="color:var(--warn)">Not on the report yet</b><ul class="plain small">${sum.left.map(x => html`<li>${x.c.date ? C.fmtNice(x.c.date) : 'Undated'} ${x.c.category && C.CAT[x.c.category] ? '· ' + C.CAT[x.c.category].label : ''}${x.c.vendor ? ' · ' + x.c.vendor : ''}: ${x.issue}</li>`)}</ul></div>`}
      </div>
    </section>`}
    ${viewer && html`<${ImageViewer} c=${viewer} onClose=${() => setViewer(null)} />`}
  </div>`;
}

function shortIssue(t) {
  if (/OK to include/.test(t)) return 'Needs your OK';
  if (/CAD amount/.test(t)) return 'Needs CAD amount';
  return t.replace(/^needs/, 'Needs').replace(/^is still/, 'Still').replace(/^amount/, 'Amount');
}
function ChargeItem({ c, st, open, onToggle, reportId, onView }) {
  const url = useImageURL(c.imageId);
  const issue = C.chargeIssue(c);
  const cat = C.CAT[c.category];
  const val = C.chargeCAD(c);
  let chips = [];
  if (c.ai === 'processing') chips.push(html`<span class="chip info"><span class="spin"></span>Adding photo</span>`);
  else if (c.ai === 'reading') chips.push(html`<span class="chip info"><span class="spin"></span>Reading receipt</span>`);
  else {
    if (c.ai === 'read' && !c.checked) chips.push(html`<span class="chip warn"><span class="dot"></span>Check details</span>`);
    if (issue) chips.push(html`<span class="chip bad"><span class="dot"></span>${shortIssue(issue)}</span>`);
    if (st && st.state === 'on') chips.push(html`<span class="chip ok"><${Icon} n="check" size=${12} />On statement</span>`);
    if (st && st.state === 'mismatch') chips.push(html`<span class="chip bad"><span class="dot"></span>Statement shows ${cad(st.amount)}</span>`);
    if (st && st.state === 'missing') chips.push(html`<span class="chip warn"><span class="dot"></span>Not on statement</span>`);
    if (!c.imageId) chips.push(html`<span class="chip warn"><span class="dot"></span>No receipt</span>`);
  }
  return html`<div class="charge">
    <button class="charge-row" onClick=${onToggle} aria-expanded=${open}>
      <span class="thumb">${url ? html`<img src=${url} alt="" />` : html`<${Icon} n=${c.imageId ? 'receipt' : 'plus'} />`}</span>
      <span style="min-width:0;display:grid;gap:3px">
        <span class="l1">${c.date && C.isISO(c.date) ? C.fmtNice(c.date) : 'Date needed'}${cat ? ' · ' + cat.label : ''}</span>
        <span class="l2">${c.vendor && html`<span>${c.vendor}</span>`}${c.payment && html`<span class="faint">${c.payment}</span>`}${chips}</span>
      </span>
      <span class="amt">${val !== null ? cad(val) : html`<span class="faint">—</span>`}${c.currency && c.currency !== 'CAD' && c.amount !== null && c.amount !== undefined ? html`<small>${c.currency} ${C.round2(c.amount).toFixed(2)}</small>` : ''}</span>
    </button>
    ${open && html`<${ChargeEdit} c=${c} url=${url} reportId=${reportId} onView=${onView} onDone=${onToggle} />`}
  </div>`;
}
function ChargeEdit({ c, url, reportId, onView, onDone }) {
  const set = (patch) => Model.update(reportId, r => patchCharge(r, c.id, patch));
  const cat = C.CAT[c.category];
  const id = (k) => 'ch-' + c.id + '-' + k;
  async function del() {
    const ok = await askConfirm({ title: 'Delete this charge?', body: c.imageId ? 'The charge and its receipt photo will be removed from this report.' : 'The charge will be removed from this report.', yes: 'Delete charge', danger: true });
    if (!ok) return;
    Model.update(reportId, r => {
      const charges = r.charges.filter(x => x.id !== c.id);
      if (c.imageId && Svc.store && !charges.some(x => x.imageId === c.imageId)) Svc.store.deleteImage(c.imageId).catch(() => {});
      // its statement line comes off the claim too
      const statements = (r.statements || []).map(p => (p.rows.some(x => x.chargeId === c.id) ? { ...p, rows: p.rows.map(x => (x.chargeId === c.id ? { ...x, chargeId: null, claim: false } : x)) } : p));
      return { ...r, charges, statements };
    });
  }
  const busy = c.ai === 'processing' || c.ai === 'reading';
  return html`<div class="charge-edit">
    ${c.aiNote && html`<p class="small" style="color:var(--warn)">${c.aiNote}</p>`}
    ${(c.imageId || busy) && html`<div class="photo">
      <button class="big" onClick=${onView} aria-label="View receipt photo" disabled=${!url}>${url ? html`<img src=${url} alt="Receipt photo" />` : html`<span class="spin"></span>`}</button>
      <p class="small muted">${busy ? 'Reading the receipt…' : c.ai === 'read' ? 'Filled in by Claude from the photo. Compare it with the receipt, then confirm.' : 'Tap the photo to see it full size.'}</p>
    </div>`}
    <div class="fields">
      <${Field} id=${id('date')} label="Date"><input id=${id('date')} class=${'inp' + (!C.isISO(c.date) ? ' bad' : '')} type="date" value=${c.date || ''} onChange=${e => set({ date: e.target.value || null })} /><//>
      <${Field} id=${id('cat')} label="Type">
        <select id=${id('cat')} class=${'inp' + (!cat ? ' bad' : '')} value=${c.category || ''} onChange=${e => set({ category: e.target.value, approved: false })}>
          ${!cat && html`<option value="">Choose…</option>`}
          <optgroup label="Usually claimed">${C.CATS.filter(x => x.q).map(x => html`<option value=${x.key}>${x.label}</option>`)}</optgroup>
          <optgroup label="Only with your OK">${C.CATS.filter(x => !x.q).map(x => html`<option value=${x.key}>${x.label}</option>`)}</optgroup>
        </select>
      <//>
      <${Field} id=${id('vendor')} label="Vendor"><${TextInput} id=${id('vendor')} value=${c.vendor} max=${60} placeholder="e.g. Uber" onValue=${v => set({ vendor: v })} /><//>
      <${Field} id=${id('amt')} label="Amount on receipt">
        <div class="money-row">
          <${MoneyInput} id=${id('amt')} value=${c.amount} onValue=${v => set({ amount: v })} bad=${c.currency === 'CAD' && C.chargeCAD(c) === null} />
          <select id=${id('cur')} class=${'inp' + (!c.currency ? ' bad' : '')} aria-label="Currency" value=${c.currency || ''} onChange=${e => set({ currency: e.target.value })}>
            ${!c.currency && html`<option value="">—</option>`}
            ${CURRENCIES.concat(c.currency && !CURRENCIES.includes(c.currency) ? [c.currency] : []).map(k => html`<option value=${k}>${k}</option>`)}
          </select>
        </div>
      <//>
      ${c.currency && c.currency !== 'CAD' && html`<${Field} id=${id('cad')} label="CAD charged to your card" hint="From your card statement. MyExpense never converts currencies.">
        <${MoneyInput} id=${id('cad')} value=${c.cad} onValue=${v => set({ cad: v })} bad=${C.chargeCAD(c) === null} />
      <//>`}
    </div>
    ${cat && !cat.q && html`<label class="check"><input type="checkbox" checked=${!!c.approved} onChange=${e => set({ approved: e.target.checked })} /><span><b>Include on this report.</b> ${cat.label} isn’t on the usual list (taxi, rental, baggage, fuel). Tick this only if it’s approved.</span></label>`}
    ${!c.imageId && !busy && html`<div class="no-receipt"><span class="small">No receipt on this charge. It stays on the report; attach the receipt if you have it.</span><${AttachButton} reportId=${reportId} chargeId=${c.id} /></div>`}
    <div class="edit-actions">
      <button class="btn sm ghost danger" onClick=${del}><${Icon} n="trash" size=${18} />Delete</button>
      ${c.ai === 'read' && !c.checked
        ? html`<button class="btn sm primary" onClick=${() => { set({ checked: true }); onDone(); }}><${Icon} n="check" size=${18} />Details are correct</button>`
        : html`<button class="btn sm" onClick=${onDone}>Done</button>`}
    </div>
  </div>`;
}
function ImageViewer({ c, onClose }) {
  const url = useImageURL(c.imageId);
  const [isPdf, setIsPdf] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { let live = true; if (Svc.store.getOriginal) Svc.store.getOriginal(c.imageId).then(o => { if (live) setIsPdf(!!(o && o.type === 'application/pdf')); }).catch(() => {}); return () => { live = false; }; }, [c.imageId]);
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
    <div class="sheet viewer" role="dialog" aria-label="Receipt photo">
      <div class="sheet-h"><h2>${c.vendor || 'Receipt'}${c.date ? ' · ' + C.fmtNice(c.date) : ''}</h2><button class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div>
      ${url ? html`<img src=${url} alt="Receipt photo" />` : html`<div class="skel" style="height:300px"></div>`}
      <button class="btn" disabled=${busy || !url} onClick=${async () => { setBusy(true); try { await downloadReceipt(c); } finally { setBusy(false); } }}><${Icon} n="download" />${isPdf ? 'Download receipt PDF' : 'Download photo'}</button>
    </div>
  </div>`;
}

/* ---- bank statement ---- */
const label = (c) => (c.date ? C.fmtMonD(c.date) + ' ' : '') + (c.vendor || (C.CAT[c.category] ? C.CAT[c.category].label : 'charge'));
function StatementSection({ r }) {
  const upRef = useRef(null), camRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [viewer, setViewer] = useState(null);
  const pages = r.statements || [];
  const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  const chk = C.statementCheck(r);
  const noReceipt = C.missingReceipts(r);
  const offers = C.receiptSuggestions(r);
  const add = (files) => { if (files && files.length) addStatementFiles(r.id, files); };
  const trouble = chk.missing.length || chk.mismatches.length || noReceipt.length;
  return html`<section class=${'panel stmt' + (drag ? ' drag' : '')} aria-labelledby="stmt-h"
      onDragOver=${e => { e.preventDefault(); setDrag(true); }} onDragLeave=${() => setDrag(false)}
      onDrop=${e => { e.preventDefault(); setDrag(false); if (e.dataTransfer) add(e.dataTransfer.files); }}>
    <div class="panel-h"><h2 id="stmt-h">Bank statement</h2>${pages.length > 0 && html`<span class="muted small">${plural(pages.length, 'page')}</span>`}</div>
    <div class="panel-b">
      <p class="muted small">Add the card statement pages that show these charges, as screenshots, photos or a PDF. Every charge ticked on the statement goes on the report, with or without a receipt. Each one is matched to its receipt, and a receipt in another currency gets its CAD amount from the statement. The statement downloads on its own, separate from the receipts.</p>
      <div class="capture-btns">
        ${touch && html`<button class="btn" onClick=${() => camRef.current && camRef.current.click()}><${Icon} n="camera" />Photograph a page</button>`}
        <button class="btn" onClick=${() => upRef.current && upRef.current.click()}><${Icon} n="upload" />Add statement pages</button>
      </div>
      <input ref=${camRef} id="st-cam" class="vh" type="file" accept="image/*" capture="environment" onChange=${e => { add(e.target.files); e.target.value = ''; }} />
      <input ref=${upRef} id="st-up" class="vh" type="file" accept="image/*,application/pdf,.docx" multiple onChange=${e => { add(e.target.files); e.target.value = ''; }} />
      ${chk.ready && r.charges.length > 0 && html`<div class=${'stmt-sum' + (trouble ? ' warn' : ' ok')}>
        <${Icon} n=${trouble ? 'alert' : 'check'} size=${18} />
        <span>${chk.onStatement.size} of ${plural(r.charges.length, 'charge')} on the report ${chk.onStatement.size === 1 ? 'is' : 'are'} on your statement.${chk.mismatches.length ? ' ' + plural(chk.mismatches.length, 'amount') + ' ' + (chk.mismatches.length === 1 ? 'doesn’t' : 'don’t') + ' match.' : ''}${chk.missing.length ? ' Not on the statement: ' + chk.missing.map(label).join(', ') + '.' : ''}${noReceipt.length ? ' Missing ' + (noReceipt.length === 1 ? 'a receipt' : plural(noReceipt.length, 'receipt')) + ': ' + noReceipt.map(label).join(', ') + '.' : ''}</span>
      </div>`}
      ${offers.map(o => html`<div class="stmt-bar" key=${o.receipt.id}><span class="small">Is your ${o.receipt.vendor || 'receipt'} receipt (${o.receipt.currency} ${C.round2(o.receipt.amount || 0).toFixed(2)}, ${o.receipt.date ? C.fmtMonD(o.receipt.date) : 'undated'}) for ${o.row.description || 'the statement line'} (${cad(o.row.amount)}, ${o.row.date ? C.fmtMonD(o.row.date) : 'undated'})?</span>
        <button class="btn sm primary" onClick=${() => Model.update(r.id, q => C.attachReceipt(q, o.charge.id, o.receipt.id))}>Yes, match them</button></div>`)}
      ${pages.map((p, i) => html`<${StatementPage} key=${p.id} r=${r} p=${p} n=${i + 1} links=${chk.links} onView=${() => setViewer(p.id)} />`)}
    </div>
    ${viewer && pages.some(p => p.id === viewer) && html`<${StatementViewer} p=${pages.find(p => p.id === viewer)} onClose=${() => setViewer(null)} />`}
  </section>`;
}
const PAIRED = ['linked', 'same', 'fx'];
function StatementPage({ r, p, n, links, onView }) {
  const url = useImageURL(p.imageId);
  const [all, setAll] = useState(false);
  const [edit, setEdit] = useState(null);
  const busy = p.ai === 'processing' || p.ai === 'reading';
  const onClaim = (x) => x.claim || (links.get(x.id) && PAIRED.includes(links.get(x.id).how));
  const claimed = p.rows.filter(onClaim);
  const shown = all ? p.rows : claimed;
  async function remove() {
    const ok = await askConfirm({ title: 'Remove this statement page?', body: 'The page comes off the report. Charges already on the report stay on it.', yes: 'Remove page', danger: true });
    if (!ok) return;
    Model.update(r.id, x => ({ ...x, statements: x.statements.filter(q => q.id !== p.id) }));
    if (p.imageId && Svc.store && !(r.statements || []).some(q => q.id !== p.id && q.imageId === p.imageId)) Svc.store.deleteImage(p.imageId).catch(() => {});
  }
  function addRow() {
    const id = uid('s');
    Model.update(r.id, x => patchPage(x, p.id, q => ({ ...q, rows: [...q.rows, { id, date: null, description: '', amount: null, currency: 'CAD', credit: false, foreign: null, category: 'taxi', marked: false, claim: true, chargeId: null, source: 'you' }] })));
    setAll(true); setEdit(id);
  }
  let status;
  if (p.ai === 'processing') status = html`<span class="chip info"><span class="spin"></span>Adding page</span>`;
  else if (p.ai === 'reading') status = html`<span class="chip info"><span class="spin"></span>Reading statement</span>`;
  else if (p.rows.length) status = html`<span class="chip info">${plural(claimed.length, 'charge')} on the report, of ${p.rows.length} lines</span>`;
  return html`<div class="stmt-page">
    <div class="stmt-head">
      <button class="thumb stmt-thumb" onClick=${onView} disabled=${!url} aria-label=${'View statement page ' + n}>${url ? html`<img src=${url} alt="" />` : busy ? html`<span class="spin"></span>` : html`<${Icon} n="receipt" />`}</button>
      <div style="display:grid;gap:4px;min-width:0">
        <b>Page ${n}<span class="muted" style="font-weight:400">${p.name ? ' · ' + p.name : ''}${p.card ? ' · ' + p.card : ''}</span></b>
        <span class="l2">${status}</span>
        <div class="row-btns"><button class="btn sm ghost danger" onClick=${remove}><${Icon} n="trash" size=${16} />Remove page</button></div>
      </div>
    </div>
    ${p.aiNote && html`<p class="small" style="color:var(--warn)">${p.aiNote}</p>`}
    ${shown.length > 0 && html`<ul class="stmt-rows">${shown.map(x => html`<${StatementRow} key=${x.id} r=${r} p=${p} x=${x} link=${links.get(x.id)} editing=${edit === x.id} onEdit=${() => setEdit(edit === x.id ? null : x.id)} />`)}</ul>`}
    <div class="row-btns">
      ${p.rows.length > claimed.length && html`<button class="linkbtn" onClick=${() => setAll(!all)}>${all ? 'Show only charges on the report' : 'Show all ' + p.rows.length + ' lines'}</button>`}
      ${!busy && html`<button class="linkbtn" onClick=${addRow}>Add a charge from this page</button>`}
    </div>
  </div>`;
}
function AttachButton({ reportId, chargeId, label }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  return html`<span>
    <button class="btn sm" disabled=${busy} onClick=${() => ref.current && ref.current.click()}><${Icon} n="receipt" size=${16} />${busy ? 'Attaching…' : label || 'Attach receipt'}</button>
    <input ref=${ref} class="vh" type="file" accept="image/*,application/pdf" aria-label="Receipt to attach" onChange=${async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; setBusy(true); try { await attachReceiptFile(reportId, chargeId, f); } finally { setBusy(false); } }} />
  </span>`;
}
function StatementRow({ r, p, x, link, editing, onEdit }) {
  const set = (patch) => Model.update(r.id, q => patchRow(q, p.id, x.id, patch));
  const id = (k) => 'sr-' + x.id + '-' + k;
  const c = link && link.charge;
  const paired = link && PAIRED.includes(link.how);
  const what = c ? (C.CAT[c.category] ? C.CAT[c.category].label : 'charge') + (c.vendor ? ' · ' + c.vendor : '') : '';
  // Ticking a line puts it on the report; unticking takes off the charge it made, if it has no receipt
  function toggle(on) {
    if (on) { set({ claim: true }); return; }
    Model.update(r.id, q => {
      const ch = x.chargeId && q.charges.find(y => y.id === x.chargeId);
      const out = patchRow(q, p.id, x.id, { claim: false, chargeId: null });
      return ch && !ch.imageId ? { ...out, charges: out.charges.filter(y => y.id !== ch.id) } : out;
    });
  }
  const locked = paired && c && !!c.imageId; // paired with a receipt: delete the charge to take it off
  let state = null;
  if (paired) {
    const v = C.chargeCAD(c);
    const off = (x.currency || 'CAD') === 'CAD' && v !== null && Math.abs(v - x.amount) >= 0.005;
    state = html`${off
      ? html`<span class="chip bad"><span class="dot"></span>The report has ${cad(v)} for ${what}</span>
          <button class="btn sm" onClick=${() => Model.update(r.id, q => patchCharge(q, c.id, c.currency === 'CAD' ? { amount: x.amount } : { cad: x.amount }))}>Use ${cad(x.amount)} from the statement</button>`
      : html`<span class="chip ok"><${Icon} n="check" size=${14} />On the report: ${what}</span>`}
      ${c.imageId ? html`<span class="chip ok"><${Icon} n="receipt" size=${12} />Receipt</span>` : html`<span class="chip warn"><span class="dot"></span>No receipt</span><${AttachButton} reportId=${r.id} chargeId=${c.id} />`}`;
  } else if (link && link.how === 'cad') {
    state = html`<button class="btn sm" onClick=${() => Model.update(r.id, q => patchRow(patchCharge(q, c.id, { cad: x.amount }), p.id, x.id, { chargeId: c.id }))}>
      Is this ${c.vendor || 'the charge'} (${c.currency} ${C.round2(c.amount || 0).toFixed(2)})? Use ${cad(x.amount)} as its CAD</button>`;
  } else if (link && link.how === 'dupe') state = html`<span class="chip info">Also on another page</span>`;
  else if (x.claim && x.amount === null) state = html`<span class="chip warn"><span class="dot"></span>Add the amount to put it on the report</span>`;
  const fx = x.foreign ? x.foreign.currency + ' ' + x.foreign.amount.toFixed(2) : '';
  return html`<li class=${'stmt-row' + (x.claim || paired ? ' on' : '')}>
    <div class="stmt-line">
      <input id=${id('claim')} type="checkbox" checked=${!!(x.claim || paired)} disabled=${x.credit || locked} aria-label=${'Put ' + (x.description || 'this charge') + ' on the report'} onChange=${e => toggle(e.target.checked)} />
      <label for=${id('claim')} class="stmt-desc"><span class="d mono">${x.date ? C.fmtMonD(x.date) : '—'}</span><span>${x.description || html`<span class="faint">No description</span>`}${fx && html`<span class="faint"> · ${fx}</span>`}${x.credit && html`<span class="faint"> · credit</span>`}</span></label>
      <span class="mono stmt-amt">${x.amount !== null ? C.round2(x.amount).toFixed(2) : '—'}</span>
      <button class="icon-btn sm" onClick=${onEdit} aria-label=${'Edit ' + (x.description || 'this line')} aria-expanded=${editing}><${Icon} n="edit" size=${16} /></button>
    </div>
    ${state && html`<div class="stmt-state">${state}</div>`}
    ${editing && html`<div class="fields stmt-edit">
      <${Field} id=${id('date')} label="Date"><input id=${id('date')} class="inp" type="date" value=${x.date || ''} onChange=${e => set({ date: e.target.value || null })} /><//>
      <${Field} id=${id('desc')} label="Description"><${TextInput} id=${id('desc')} value=${x.description} max=${60} onValue=${v => set({ description: v })} /><//>
      <${Field} id=${id('amt')} label=${'Amount (' + (x.currency || 'CAD') + ')'}><${MoneyInput} id=${id('amt')} value=${x.amount} onValue=${v => set({ amount: v })} /><//>
      <${Field} id=${id('cat')} label="Type on the report">
        <select id=${id('cat')} class="inp" value=${x.category} onChange=${e => set({ category: e.target.value })}>${C.CATS.map(k => html`<option value=${k.key}>${k.label}</option>`)}</select>
      <//>
      <div class="row-btns"><button class="btn sm" onClick=${onEdit}>Done</button>${x.source === 'you' && html`<button class="btn sm ghost danger" onClick=${() => { toggle(false); Model.update(r.id, q => patchPage(q, p.id, pg => ({ ...pg, rows: pg.rows.filter(y => y.id !== x.id) }))); }}>Delete line</button>`}</div>
    </div>`}
  </li>`;
}
function StatementViewer({ p, onClose }) {
  const url = useImageURL(p.imageId);
  const [busy, setBusy] = useState(false);
  const dl = async (orig) => { setBusy(true); try { await downloadStatementPage(p, orig); } finally { setBusy(false); } };
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
    <div class="sheet viewer stmt-viewer" role="dialog" aria-label="Statement page">
      <div class="sheet-h"><h2>${p.name || 'Statement page'}</h2><button class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div>
      ${url ? html`<img src=${url} alt="Statement page" />` : html`<div class="skel" style="height:300px"></div>`}
      <div class="row-btns">
        <button class="btn" disabled=${busy || !url} onClick=${() => dl(false)}><${Icon} n="download" />Download this page</button>
        ${p.orig && html`<button class="btn" disabled=${busy} onClick=${() => dl(true)}><${Icon} n="download" />Download the PDF as uploaded</button>`}
      </div>
    </div>
  </div>`;
}

/* ---- export sheet ---- */
function OutButton({ ext, title, sub, busy, disabled, onClick }) {
  return html`<button class="out-btn" disabled=${disabled} onClick=${onClick}>
    <span class=${'ext ' + ext.toLowerCase()}>${ext}</span>
    <span><b>${busy ? 'Building…' : title}</b><span>${sub}</span></span>
    <${Icon} n="download" />
  </button>`;
}
function ExportSheet({ r, onClose }) {
  const [busy, setBusy] = useState(null);
  const isPd = r.type === 'perdiem';
  const problems = isPd ? C.perDiemProblems(r) : C.itemizedProblems(r);
  const sum = isPd ? C.perDiemSummary(r) : C.itemizedSummary(r);
  const warns = [], notes = [];
  let receipts = [];
  if (!isPd) {
    if (!(r.manager || '').trim()) warns.push('No manager name yet, so the Manager Name box on the report will be blank.');
    const reading = r.charges.filter(c => c.ai === 'reading' || c.ai === 'processing').length;
    if (reading) warns.push(plural(reading, 'receipt') + ' still being read. Wait a moment so ' + (reading === 1 ? 'it lands' : 'they land') + ' on the report.');
    const unchecked = r.charges.filter(c => c.ai === 'read' && !c.checked && !C.chargeIssue(c)).length;
    if (unchecked) warns.push(plural(unchecked, 'charge') + ' read by Claude ' + (unchecked === 1 ? 'hasn’t' : 'haven’t') + ' been checked against the receipt yet.');
    const left = sum.left.filter(x => x.c.ai !== 'reading' && x.c.ai !== 'processing');
    if (left.length) warns.push(plural(left.length, 'charge') + ' will be left off: ' + left.map(x => (x.c.date ? C.fmtMonD(x.c.date) : 'undated') + ' ' + x.issue).join('; ') + '.');
    const inc = sum.weeks.flatMap(w => w.charges);
    const okd = new Map();
    for (const c of inc) if (!C.CAT[c.category].q) okd.set(c.category, (okd.get(c.category) || 0) + 1);
    if (okd.size) notes.push('Included with your OK: ' + [...okd].map(([k, n]) => C.CAT[k].label + (n > 1 ? ' ×' + n : '')).join(', ') + '.');
    const fx = inc.filter(c => c.currency !== 'CAD').length;
    if (fx) notes.push('CAD amount entered by you for ' + plural(fx, 'foreign-currency receipt') + '.');
    notes.push('HST columns left blank.');
    receipts = C.receiptList(r);
    const noR = C.missingReceipts(r).filter(c => !C.chargeIssue(c));
    if (noR.length) warns.push('Missing ' + (noR.length === 1 ? 'a receipt' : plural(noR.length, 'receipt')) + ': ' + noR.map(c => label(c)).join(', ') + '. ' + (noR.length === 1 ? 'It’s' : 'They’re') + ' on the report without one.');
    const pages = r.statements || [];
    const stReading = pages.filter(p => p.ai === 'reading' || p.ai === 'processing').length;
    if (stReading) warns.push(plural(stReading, 'statement page') + ' still being read.');
    if (pages.length) {
      const chk = C.statementCheck(r);
      if (chk.missing.length) warns.push(plural(chk.missing.length, 'charge') + ' on the report ' + (chk.missing.length === 1 ? 'isn’t' : 'aren’t') + ' on your bank statement: ' + chk.missing.map(c => (c.date ? C.fmtMonD(c.date) + ' ' : '') + (c.vendor || (C.CAT[c.category] ? C.CAT[c.category].label : 'charge'))).join(', ') + '. Add the statement page that shows ' + (chk.missing.length === 1 ? 'it' : 'them') + '.');
      if (chk.mismatches.length) warns.push(plural(chk.mismatches.length, 'charge') + ' on the report ' + (chk.mismatches.length === 1 ? 'doesn’t' : 'don’t') + ' match the amount on your statement. Fix ' + (chk.mismatches.length === 1 ? 'it' : 'them') + ' under Bank statement.');
      if (chk.unlisted.length) warns.push(plural(chk.unlisted.length, 'line') + ' ticked on your statement ' + (chk.unlisted.length === 1 ? 'needs' : 'need') + ' an amount to go on the report.');
      if (chk.suggestions.length) warns.push('Your statement may show the CAD for ' + plural(chk.suggestions.length, 'foreign-currency charge') + '. Check under Bank statement.');
    }
  }
  const stTicked = isPd ? 0 : C.statementList(r).length;
  const partialDates = isPd ? sum.weeks.flatMap(w => w.days).filter(d => d.partial).map(d => C.fmtNice(d.date)) : [];
  async function run(kind) {
    setBusy(kind);
    try {
      await flush(r.id);
      if (kind === 'xlsx') await exportXlsx(r);
      else if (kind === 'pdf') await exportPdf(r);
      else if (kind === 'rpdf') await exportReceiptsPdf(r);
      else if (kind === 'zip') await exportReceiptsZip(r);
      else if (kind === 'stmt') await exportStatementPdf(r);
      else if (kind === 'stzip') await exportStatementFiles(r);
    } catch (e) { console.error(e); toast('Couldn’t build the file: ' + (e && e.message ? e.message : 'unknown error')); }
    setBusy(null);
  }
  const blocked = problems.length > 0;
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
    <div class="sheet" role="dialog" aria-label="Download report">
      <div class="sheet-h"><h2>Download & print</h2><button class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div>
      ${blocked ? html`<div class="issues">${problems.map(p => html`<div class="issue bad"><${Icon} n="alert" size=${18} /><span>${p.msg}</span></div>`)}</div>`
        : html`<div class="math">
            ${sum.weeks.map(w => html`<div class="row"><span>${w.title}</span><span>${isPd ? usd(w.total) : cad(w.total)}</span></div>`)}
            <div class="row tot"><span>Total (${isPd ? 'USD' : 'CAD'})</span><span>${isPd ? usd(sum.total) : cad(sum.total)}</span></div>
          </div>
          ${isPd && html`<p class="small"><b>Partial days:</b> ${partialDates.length ? partialDates.join(', ') : 'none'}</p>`}
          ${!isPd && sum.weeks.length > 0 && html`<details class="byday">
            <summary>Charges by day</summary>
            ${sum.weeks.map(w => html`<div class="byday-week"><span class="caps muted">${w.title}</span>
              ${w.charges.map(c => html`<div class="row"><span>${C.fmtNice(c.date)} · ${C.CAT[c.category].label}${c.vendor ? ' · ' + c.vendor : ''}</span><span class="mono">${cad(C.chargeCAD(c))}</span></div>`)}
            </div>`)}
          </details>`}
          ${notes.length > 0 && html`<p class="small muted">${notes.join(' ')}</p>`}`}
      ${!blocked && warns.length > 0 && html`<div class="issues">${warns.map(w => html`<div class="issue warn"><${Icon} n="alert" size=${18} /><span>${w}</span></div>`)}</div>`}
      <div class="out-group">
        <span class="caps muted">Report form</span>
        <${OutButton} ext="XLSX" title="Excel workbook" sub=${'The ' + (isPd ? 'Travel Expense Report' : 'Expense Claim Report') + ' template, one sheet per week'} busy=${busy === 'xlsx'} disabled=${blocked || !!busy} onClick=${() => run('xlsx')} />
        <${OutButton} ext="PDF" title="Print-ready PDF" sub="The same form, one landscape page per week" busy=${busy === 'pdf'} disabled=${blocked || !!busy} onClick=${() => run('pdf')} />
      </div>
      ${!isPd && html`<div class="out-group">
        <span class="caps muted">Receipts${receipts.length ? ' · ' + receipts.length : ''}</span>
        ${receipts.length === 0 ? html`<p class="small muted">No receipt photos on the charges in this report yet.</p>` : html`
          <${OutButton} ext="PDF" title="Receipts PDF" sub="Every receipt, two per page, numbered and labelled with date, type and amount" busy=${busy === 'rpdf'} disabled=${!!busy} onClick=${() => run('rpdf')} />
          <${OutButton} ext="ZIP" title="Receipt files" sub="Each receipt as its own file, named by number, date, type and amount" busy=${busy === 'zip'} disabled=${!!busy} onClick=${() => run('zip')} />`}
      </div>`}
      ${!isPd && html`<div class="out-group">
        <span class="caps muted">Bank statement${(r.statements || []).length ? ' · ' + plural(r.statements.length, 'page') : ''}</span>
        ${!(r.statements || []).length ? html`<p class="small muted">No statement pages on this report. Add them under Bank statement to download them here.</p>`
          : html`<${OutButton} ext="PDF" title="Bank statement PDF" sub=${(stTicked ? 'The ' + plural(stTicked, 'statement charge') + ' on the claim, each with its report charge, then ' : 'Your ') + 'statement pages'} busy=${busy === 'stmt'} disabled=${!!busy} onClick=${() => run('stmt')} />
            <${OutButton} ext="ZIP" title="Statement files" sub="Your statements as you uploaded them: PDFs as they were, screenshots and photos as pictures" busy=${busy === 'stzip'} disabled=${!!busy} onClick=${() => run('stzip')} />`}
      </div>`}
      <p class="faint small">File name: ${C.fileBase(r)}</p>
    </div>
  </div>`;
}

function SettingsSheet({ onClose }) {
  const [name, setName] = useState(Model.settings.name || '');
  const [mgr, setMgr] = useState(Model.settings.manager || '');
  const [wiping, setWiping] = useState(false);
  async function wipe() {
    const ok = await askConfirm({ title: 'Delete all your MyExpense data?', body: 'Every report, receipt photo and saved detail of yours is erased for good. Download anything you still need first.', yes: 'Delete everything', danger: true });
    if (!ok) return;
    setWiping(true);
    for (const t of timers.values()) clearTimeout(t);
    timers.clear();
    try {
      await Svc.store.deleteAll();
      for (const u of urlCache.values()) URL.revokeObjectURL(u);
      urlCache.clear();
      Model.reports = []; Model.settings = {}; emit();
      toast('All your MyExpense data was deleted.');
      onClose();
    } catch (e) { if (writeFailed(e)) toast('Couldn’t delete everything. Try again.'); }
    setWiping(false);
  }
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
    <form class="sheet" role="dialog" aria-label="Your details" onSubmit=${e => { e.preventDefault(); Model.saveSettings({ ...Model.settings, name: name.trim(), manager: mgr.trim() }); toast('Saved. New reports start with these details.'); onClose(); }}>
      <div class="sheet-h"><h2>Your details</h2><button type="button" class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div>
      <p class="muted small">New reports start with these. You can still change them on any report.</p>
      <${Field} id="set-name" label="Your full name"><${TextInput} id="set-name" value=${name} autocomplete="name" placeholder="First and last name" onValue=${setName} /><//>
      <${Field} id="set-mgr" label="Manager name (itemized reports)"><${TextInput} id="set-mgr" value=${mgr} placeholder="Manager’s first and last name" onValue=${setMgr} /><//>
      <button class="btn primary" type="submit">Save details</button>
      <div class="terms" style="display:grid;gap:4px">
        <b style="font-family:var(--f-body)">Your privacy</b>
        ${PUI.privacy(aiOn()).map(t => html`<span class="muted">${t}</span>`)}
      </div>
      <button type="button" class="btn ghost danger" disabled=${wiping} onClick=${wipe}><${Icon} n="trash" size=${18} />${wiping ? 'Deleting…' : 'Delete all my data'}</button>
    </form>
  </div>`;
}
function ConfirmDialog() {
  const s = confirmState; if (!s) return null;
  const done = (v) => { confirmState = null; emit(); s.res(v); };
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) done(false); }}>
    <div class="sheet" role="alertdialog" aria-label=${s.title}>
      <h2>${s.title}</h2>${s.body && html`<p class="muted">${s.body}</p>`}
      <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap">
        <button class="btn" onClick=${() => done(false)}>Cancel</button>
        <button class=${'btn primary'} style=${s.danger ? 'background:var(--bad);border-color:var(--bad);color:#fff' : ''} onClick=${() => done(true)}>${s.yes || 'OK'}</button>
      </div>
    </div>
  </div>`;
}

function Editor({ id, back }) {
  const r = Model.get(id);
  const [exp, setExp] = useState(false);
  if (!r) return html`<div class="wrap"><div class="empty">This report was deleted.<button class="btn" onClick=${back}>Back to reports</button></div></div>`;
  const isPd = r.type === 'perdiem';
  const st = reportStatus(r);
  async function del() {
    const ok = await askConfirm({ title: 'Delete this report?', body: (r.customer || 'This report') + (isPd ? '' : ' and its receipt photos') + ' will be deleted for good.', yes: 'Delete report', danger: true });
    if (ok) { await Model.remove(r.id); back(true); }
  }
  return html`
    <header class="bar"><${EnvBand} /><div class="bar-in">
      <button class="icon-btn" onClick=${() => back()} aria-label="Back to reports"><${Icon} n="back" /></button>
      <div class="bar-title">
        <h1>${r.customer || (isPd ? 'New per diem report' : 'New itemized report')}</h1>
        <div class="sub"><span class=${'tag ' + (isPd ? 'pd' : 'it')} style="height:18px;font-size:10px">${isPd ? 'Per diem' : 'Itemized'}</span><${SaveState} /></div>
      </div>
      <button class="icon-btn" onClick=${del} aria-label="Delete report" title="Delete report"><${Icon} n="trash" /></button>
    </div></header>
    ${isPd ? html`<${PerDiemEditor} r=${r} />` : html`<${ItemizedEditor} r=${r} />`}
    <div class="dock"><div class="dock-in">
      <div class="t"><b>${isPd ? usd(st.total) : cad(st.total)}</b><span>${st.problems.length ? st.problems[0].msg : (isPd ? 'Total per diem (USD)' : 'Total claimed (CAD)') + (st.range ? ' · ' + st.range : '')}</span></div>
      <button class="btn primary" onClick=${() => setExp(true)}><${Icon} n="download" />Download</button>
    </div></div>
    ${exp && html`<${ExportSheet} r=${r} onClose=${() => setExp(false)} />`}`;
}

// The platform's own screens (sign-in, account), built with the same toolkit as the rest of the app
const PUI = PLAT.ui({ html, useState, useEffect, useRef, Icon, toast, askConfirm, Field, TextInput, Svc, ENV, emit, lostAccess, plural, initServices });
const WORDS = { pill: 'Private to you: only you can see these reports', pillIcon: 'lock', saved: 'Saved', empty: 'Start a per diem or itemized report above. Reports save as you type, and only you can see them.', ...(PUI.words || {}) };

function App() {
  useTick();
  const [route, setRoute] = useState({ view: 'home' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const loadedOnce = useRef(false);
  useEffect(() => { initServices(); }, []);
  useEffect(() => { if (Svc.access === 'ok' && !loadedOnce.current) { loadedOnce.current = true; loadAll(); } });
  useEffect(() => { if (Svc.access !== 'ok' && Svc.ready) { loadedOnce.current = false; if (route.view !== 'home') setRoute({ view: 'home' }); setSettingsOpen(false); } });
  function open(r, isNew) {
    if (isNew) Model.add(r);
    setRoute({ view: 'edit', id: r.id }); window.scrollTo(0, 0);
  }
  async function back(deleted) {
    const id = route.id;
    if (!deleted && id) {
      const r = Model.get(id);
      if (r && isBlank(r)) await Model.remove(id); else await flush(id);
      if (Svc.store && Model.settings.name && r && r.name && !(await Svc.store.getSettings().catch(() => ({}))).name) Model.saveSettings({ ...Model.settings });
    }
    Model.reports = Model.reports.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    setSave('idle'); setRoute({ view: 'home' }); window.scrollTo(0, 0);
  }
  return html`
    ${(route.view === 'home' || Svc.access !== 'ok') && html`<header class="bar"><${EnvBand} /><div class="bar-in"><div class="wordmark"><span class="stub" aria-hidden="true"></span>MyExpense${ENV.name !== 'prod' && html`<span class="envtag">${ENV.name.toUpperCase()}</span>`}</div>${PUI.HeaderRight && html`<${PUI.HeaderRight} />`}</div></header>`}
    ${Svc.access !== 'ok' ? html`<${PUI.Gate} />`
      : route.view === 'home' ? html`<${Home} open=${open} openSettings=${() => setSettingsOpen(true)} />` : html`<${Editor} key=${route.id} id=${route.id} back=${back} />`}
    ${settingsOpen && Svc.access === 'ok' && html`<${SettingsSheet} onClose=${() => setSettingsOpen(false)} />`}
    <${ConfirmDialog} />
    <div class="toasts" aria-live="polite">${toastList.map(t => html`<div class="toast" key=${t.id}>${t.msg}</div>`)}</div>`;
}

render(html`<${App} />`, document.getElementById('app'));
})();
