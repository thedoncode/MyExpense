(function () {
'use strict';
const C = window.ExpenseCore;
const LAYOUTS = {"itemized":{"range":"A1:Q40","cols":[195.0,91.5,54.0,87.0,51.75,99.0,51.75,84.75,51.75,86.25,54.0,91.5,51.0,84.75,51.75,96.75,71.25],"rows":[72.0,23.25,23.25,23.25,23.25,23.25,23.25,15.75,26.25,30.0,30.0,30.0,30.0,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,24.75,25.5,25.5,25.5,25.5,25.5,24.0,24.0],"margins":{"left":18.0,"right":18.0,"top":21.599999999999998,"bottom":20.14999999999999},"styles":[{"fn":"Arial","sz":72.0,"b":true,"i":true,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":36.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"left","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"d-mmm-yy"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"mm-dd-yy"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFF00","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFF00","bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":true,"i":false,"u":false,"fc":"000000","fill":"FFFF00","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":20.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["medium","000000"],"bt":null,"bb":["medium","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":null,"br":["thin","000000"],"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["thin","000000"],"br":null,"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":null,"br":null,"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":18.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["medium","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":null,"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"FFFFFF","fill":"FF0000","bl":["thin","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"d-mmm-yy"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFF00","bl":["medium","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":null,"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["thin","000000"],"bt":null,"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":null,"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00_);\"($\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":null,"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":null,"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":null,"bb":["thin","000000"],"ha":"center","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["thin","000000"],"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00_);\"($\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["thin","000000"],"bb":["thin","000000"],"ha":"center","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":"left","va":"center","wrap":true,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":null,"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["thin","000000"],"bb":null,"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00_);\"($\"#,##0.00\\)"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["thin","000000"],"bb":null,"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["medium","000000"],"br":["medium","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"right","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"D9D9D9","bl":["medium","000000"],"br":["thin","000000"],"bt":["medium","000000"],"bb":["medium","000000"],"ha":"center","va":"center","wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":20.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"\\$#,##0.00;\"($\"#,##0.00\\);\\-"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"\\$#,##0.00_);\"($\"#,##0.00\\)"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"[$$-1009]#,##0.00"},{"fn":"Arial","sz":16.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"\\$#,##0.00_);\"($\"#,##0.00\\)"},{"fn":"Arial","sz":12.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"mmm-yy"}],"cells":[["A1",0,"evertz"],["D1",1,"    EXPENSE CLAIM REPORT"],["L2",2,"WEEK ENDING"],["N2",3],["O2",4],["P2",4],["L3",2,"NAME"],["N3",5],["O3",4],["P3",4],["K4",6],["L4",7,"DEPARTMENT"],["N4",8],["O4",9],["P4",9],["K5",10,"MANAGER NAME"],["L5",7],["N5",8],["O5",8],["P5",8],["L6",2,"YOUR ADDRESS (ONLY INDICATE IF CHANGED"],["N6",8],["O6",9],["P6",9],["L7",11,"SINCE LAST EXPENSE)"],["N7",8],["O7",9],["P7",9],["A9",12],["B9",13,"Sunday"],["C9",14],["D9",15,"Monday"],["E9",14],["F9",15,"Tuesday"],["G9",14],["H9",16,"Wednesday"],["I9",17],["J9",15,"Thursday"],["K9",14],["L9",15,"Friday"],["M9",14],["N9",15,"Saturday"],["O9",18],["P9",19,"             Total"],["Q9",20],["A10",21,"Date"],["B10",22],["C10",23],["D10",22],["E10",23],["F10",22],["G10",23],["H10",22],["I10",23],["J10",22],["K10",23],["L10",22],["M10",23],["N10",22],["O10",24],["P10",25],["Q10",26],["A11",27],["B11",28],["C11",29],["D11",28],["E11",29],["F11",28],["G11",29],["H11",28],["I11",29],["J11",28],["K11",29],["L11",28],["M11",29],["N11",28],["O11",29],["P11",28],["Q11",29],["A12",27,"Location"],["B12",30],["C12",31],["D12",30],["E12",31],["F12",30],["G12",31],["H12",30],["I12",31],["J12",30],["K12",31],["L12",30],["M12",31],["N12",30],["O12",31],["P12",30],["Q12",31],["A13",32],["B13",33,"Charge"],["C13",34,"HST"],["D13",35,"Charge"],["E13",34,"HST"],["F13",35,"Charge"],["G13",34,"HST"],["H13",35,"Charge"],["I13",34,"HST"],["J13",35,"Charge"],["K13",34,"HST"],["L13",35,"Charge"],["M13",34,"HST"],["N13",35,"Charge"],["O13",34,"HST"],["P13",36,"Charge"],["Q13",37,"HST"],["A14",38,"Air 'Fare"],["B14",39],["C14",40],["D14",41],["E14",40],["F14",41],["G14",40],["H14",41],["I14",40],["J14",41],["K14",40],["L14",41],["M14",40],["N14",41],["O14",40],["P14",42],["Q14",43],["A15",38,"Airport Tax"],["B15",44],["C15",45],["D15",46],["E15",45],["F15",46],["G15",45],["H15",46],["I15",45],["J15",46],["K15",45],["L15",46],["M15",45],["N15",46],["O15",45],["P15",47],["Q15",48],["A16",38,"Breakfast"],["B16",44],["C16",45],["D16",46],["E16",45],["F16",46],["G16",45],["H16",46],["I16",45],["J16",46],["K16",45],["L16",46],["M16",45],["N16",46],["O16",45],["P16",47],["Q16",48],["A17",38,"Lunch - food"],["B17",44],["C17",45],["D17",46],["E17",45],["F17",46],["G17",45],["H17",46],["I17",45],["J17",46],["K17",45],["L17",46],["M17",45],["N17",46],["O17",45],["P17",47],["Q17",48],["A18",49,"Lunch - alcohol"],["B18",44],["C18",45],["D18",46],["E18",45],["F18",46],["G18",45],["H18",46],["I18",45],["J18",46],["K18",45],["L18",46],["M18",45],["N18",46],["O18",45],["P18",47],["Q18",48],["A19",38,"Dinner - food"],["B19",44],["C19",45],["D19",46],["E19",45],["F19",46],["G19",45],["H19",46],["I19",45],["J19",46],["K19",45],["L19",46],["M19",45],["N19",46],["O19",45],["P19",47],["Q19",48],["A20",49,"Dinner - alcohol"],["B20",44],["C20",45],["D20",46],["E20",45],["F20",46],["G20",45],["H20",46],["I20",45],["J20",46],["K20",45],["L20",46],["M20",45],["N20",46],["O20",45],["P20",47],["Q20",48],["A21",38,"Late Meal/Overtime"],["B21",44],["C21",45],["D21",46],["E21",45],["F21",46],["G21",45],["H21",46],["I21",45],["J21",46],["K21",45],["L21",46],["M21",45],["N21",46],["O21",45],["P21",47],["Q21",48],["A22",38,"Snacks"],["B22",44],["C22",45],["D22",46],["E22",45],["F22",46],["G22",45],["H22",46],["I22",45],["J22",46],["K22",45],["L22",46],["M22",45],["N22",46],["O22",45],["P22",47],["Q22",48],["A23",38,"Hotel"],["B23",44],["C23",45],["D23",46],["E23",45],["F23",46],["G23",45],["H23",46],["I23",45],["J23",46],["K23",45],["L23",46],["M23",45],["N23",46],["O23",45],["P23",47],["Q23",48],["A24",38,"Auto Rental "],["B24",44],["C24",45],["D24",46],["E24",45],["F24",46],["G24",45],["H24",46],["I24",45],["J24",46],["K24",45],["L24",46],["M24",45],["N24",46],["O24",45],["P24",47],["Q24",48],["A25",38,"Entertainment (sales only)"],["B25",44],["C25",45],["D25",46],["E25",45],["F25",46],["G25",45],["H25",46],["I25",45],["J25",46],["K25",45],["L25",46],["M25",45],["N25",46],["O25",45],["P25",47],["Q25",48],["A26",38,"Parking"],["B26",44],["C26",45],["D26",46],["E26",45],["F26",46],["G26",45],["H26",46],["I26",45],["J26",46],["K26",45],["L26",46],["M26",45],["N26",46],["O26",45],["P26",47],["Q26",48],["A27",38,"Taxi"],["B27",44],["C27",45],["D27",46],["E27",45],["F27",46],["G27",45],["H27",46],["I27",45],["J27",46],["K27",45],["L27",46],["M27",45],["N27",46],["O27",45],["P27",47],["Q27",48],["A28",38,"Tips"],["B28",44],["C28",45],["D28",46],["E28",45],["F28",46],["G28",45],["H28",46],["I28",45],["J28",46],["K28",45],["L28",46],["M28",45],["N28",46],["O28",45],["P28",47],["Q28",48],["A29",38,"Fuel"],["B29",44],["C29",45],["D29",46],["E29",45],["F29",46],["G29",45],["H29",46],["I29",45],["J29",46],["K29",45],["L29",46],["M29",45],["N29",46],["O29",45],["P29",47],["Q29",48],["A30",50,"Mileage (@.70/M, .58/Km)"],["B30",44],["C30",45],["D30",46],["E30",45],["F30",46],["G30",45],["H30",46],["I30",45],["J30",46],["K30",45],["L30",46],["M30",45],["N30",46],["O30",45],["P30",47],["Q30",48],["A31",51,"Miscellaneous"],["B31",52],["C31",53],["D31",54],["E31",53],["F31",54],["G31",53],["H31",54],["I31",53],["J31",54],["K31",53],["L31",54],["M31",53],["N31",54],["O31",53],["P31",55],["Q31",56],["A32",57,"Total"],["B32",58],["C32",59],["D32",60],["E32",59],["F32",61],["G32",59],["H32",61],["I32",59],["J32",61],["K32",59],["L32",61],["M32",59],["N32",61],["O32",59],["P32",62],["Q32",63],["A33",64,"Actual Mileage:"],["M33",65],["E34",66,"AMOUNT"],["F34",67],["G34",4],["H34",4],["I34",4],["J34",4],["K34",4],["L34",4],["A35",66,"A/C"],["B35",68],["C35",68],["E35",66,"Amount"],["F35",68],["G35",69],["H35",68],["A36",66,"A/C"],["B36",70],["C36",70],["E36",66,"Amount"],["F36",71," "],["G36",72],["H36",70],["A37",66,"A/C"],["B37",70],["C37",70],["E37",66,"Amount"],["F37",71," "],["G37",70],["H37",70],["J37",66,"P.J."],["K37",68],["L37",68],["N37",66,"Signature"],["O37",68],["P37",68],["Q37",68],["A38",66,"A/C"],["B38",70],["C38",70],["E38",66,"Amount"],["F38",71," "],["G38",72],["H38",70],["J38",66,"Cheque #"],["K38",70],["L38",70],["N38",66,"Approved"],["O38",70],["P38",70],["Q38",70],["A39",66,"A/C"],["B39",70],["C39",70],["E39",66,"Amount"],["F39",71," "],["G39",70],["H39",70],["J39",66,"Date Paid"],["K39",70],["L39",70],["N39",66,"Date"],["O39",70],["P39",70],["Q39",70],["P40",73,"Revised"],["Q40",74,{"d":44896}]],"merges":["F34:H34","N7:P7","D1:L1","N2:P2","N3:P3","N4:P4","H9:I9","N6:P6"]},"perdiem":{"range":"A1:W41","cols":[5.25,63.0,77.25,114.0,49.5,61.5,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,91.5,45.75,63.75],"rows":[16.5,60.75,10.5,18.75,24.0,18.0,18.0,18.0,18.0,24.75,19.5,16.5,16.5,51.0,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,16.5,12.75,15.0,15.0,12.75,12.75,12.75,12.75,12.75],"margins":{"left":50.4,"right":50.4,"top":54.0,"bottom":54.0},"styles":[{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":72.0,"b":true,"i":true,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":36.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"left","va":"center","wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["medium","000000"],"ha":"left","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["medium","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["medium","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["medium","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":"left","va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":14.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":true,"u":false,"fc":"7030A0","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":"center","va":null,"wrap":true,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"FFFFFF","fill":"A14817","bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"FFFFFF","fill":"A14817","bl":["thin","808080"],"br":null,"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"FFFFFF","fill":"A14817","bl":["thin","D9D9D9"],"br":["thin","D9D9D9"],"bt":["thin","000000"],"bb":["thin","808080"],"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"000000","fill":"8497B0","bl":["thin","D9D9D9"],"br":["thin","D9D9D9"],"bt":["thin","000000"],"bb":["thin","808080"],"ha":"center","va":"center","wrap":true,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"000000","fill":"8497B0","bl":null,"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":true,"i":false,"u":false,"fc":"7030A0","fill":"8497B0","bl":null,"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"center","va":"center","wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","000000"],"br":null,"bt":["thin","808080"],"bb":null,"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","808080"],"bb":null,"ha":"center","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","808080"],"bb":null,"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":null,"br":["thin","000000"],"bt":["thin","808080"],"bb":null,"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","C0C0C0"],"br":["thin","000000"],"bt":["thin","C0C0C0"],"bb":["thin","C0C0C0"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","000000"],"br":null,"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFFFFF","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":9.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Tahoma","sz":9.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","D9D9D9"],"ha":"center","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","000000"],"br":null,"bt":["thin","D9D9D9"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":9.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"[$-409]d\\-mmm\\-yy;@"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":["thin","D9D9D9"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FDF6E7","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":null,"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","C0C0C0"],"br":["thin","000000"],"bt":["thin","C0C0C0"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":null,"br":["thin","000000"],"bt":null,"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","000000"],"br":["thin","000000"],"bt":["thin","C0C0C0"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","C0C0C0"],"bt":null,"bb":null,"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","C0C0C0"],"br":["thin","C0C0C0"],"bt":null,"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"C0C0C0","fill":"C0C0C0","bl":["thin","808080"],"br":null,"bt":null,"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"C0C0C0","fill":"C0C0C0","bl":["thin","000000"],"br":["thin","808080"],"bt":["thin","000000"],"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"C0C0C0","fill":"C0C0C0","bl":["thin","808080"],"br":["thin","000000"],"bt":["thin","000000"],"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":true,"u":true,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"left","va":null,"wrap":true,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":true,"i":false,"u":false,"fc":"333333","fill":null,"bl":null,"br":null,"bt":["thin","808080"],"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","808080"],"br":null,"bt":null,"bb":null,"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","000000"],"br":["thin","808080"],"bt":["thin","808080"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","808080"],"br":["thin","000000"],"bt":["thin","808080"],"bb":["thin","000000"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":10.0,"b":true,"i":false,"u":false,"fc":"333333","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","808080"],"br":["thin","808080"],"bt":["thin","C0C0C0"],"bb":["thin","C0C0C0"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":true,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"EAEAEA","bl":["thin","808080"],"br":["thin","808080"],"bt":null,"bb":["thin","808080"],"ha":"center","va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":["thin","000000"],"br":null,"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":true,"u":false,"fc":"7030A0","fill":"FFF2CC","bl":null,"br":null,"bt":["thin","000000"],"bb":null,"ha":"center","va":null,"wrap":true,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":true,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":"left","va":"top","wrap":true,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":["thin","000000"],"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Calibri","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":11.0,"b":false,"i":false,"u":true,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":null,"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":11.0,"b":false,"i":false,"u":true,"fc":"000000","fill":"FFE699","bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":"center","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":true,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":null,"ha":"right","va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":null,"bl":null,"br":null,"bt":null,"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFF2CC","bl":null,"br":null,"bt":["thin","000000"],"bb":["thin","000000"],"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":11.0,"b":false,"i":true,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Tahoma","sz":11.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"},{"fn":"Tahoma","sz":12.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":"left","va":null,"wrap":false,"nf":"_(* #,##0.00_);_(* \\(#,##0.00\\);_(* \"-\"??_);_(@_)"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":["thin","000000"],"br":null,"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"},{"fn":"Arial","sz":10.0,"b":false,"i":false,"u":false,"fc":"000000","fill":"FFE699","bl":null,"br":["thin","000000"],"bt":null,"bb":null,"ha":null,"va":null,"wrap":false,"nf":"General"}],"cells":[["A1",0],["B1",1],["C1",1],["D1",1],["E1",1],["F1",1],["G1",1],["H1",1],["I1",1],["J1",1],["U1",1],["A2",2,"evertz"],["F2",3,"TRAVEL EXPENSE REPORT"],["L4",4,"WEEK ENDING"],["N4",5],["O4",6],["P4",6],["Q4",6],["L5",4,"NAME"],["N5",7],["O5",8],["P5",8],["Q5",8],["L6",4,"DEPARTMENT"],["N6",9],["O6",10],["P6",10],["Q6",11],["L7",4,"CUSTOMER TRIP"],["N7",12],["O7",12],["P7",12],["Q7",13],["L8",4,"TRIP DESTINATION"],["N8",13],["O8",13],["P8",13],["Q8",13],["N9",13],["O9",13],["P9",13],["Q9",13],["L10",4,"YOUR ADDRESS (ONLY INDICATE IF CHANGED"],["N10",12],["O10",14],["P10",14],["Q10",13],["L11",4,"SINCE LAST EXPENSE)"],["N11",12],["O11",14],["P11",14],["Q11",13],["V13",15,"Internal Use Only"],["W13",16],["B14",17,"Receipt #"],["C14",18,"Date"],["D14",19,"Description"],["E14",19,"Currency*"],["F14",19,"Amount"],["G14",20,"Airfare / Train"],["H14",20,"Breakfast"],["I14",20,"Lunch"],["J14",20,"Dinner"],["K14",20,"Late Meal / Overtime"],["L14",20,"Per Diem"],["M14",20,"Incidentals"],["N14",20,"Hotel"],["O14",20,"Auto Rental"],["P14",20,"Parking"],["Q14",20,"Taxi"],["R14",20,"Fuel"],["S14",20,"Mileage (@.55/M, .50/KM)"],["T14",20,"Other"],["U14",21,"Total"],["V14",22,"HST"],["W14",22,"Net of HST"],["B15",23],["C15",24],["D15",25],["E15",25],["F15",25],["G15",25],["H15",25],["I15",25],["J15",25],["K15",25],["L15",25],["M15",25],["N15",25],["O15",25],["P15",25],["Q15",25],["R15",25],["S15",25],["T15",25],["U15",26],["V15",26],["W15",26],["B16",27],["C16",24],["D16",28],["E16",25],["F16",28],["G16",28],["H16",28],["I16",28],["J16",28],["K16",28],["L16",25],["M16",28],["N16",28],["O16",28],["P16",28],["Q16",28],["R16",28],["S16",28],["T16",28],["U16",29],["V16",29],["W16",29],["B17",30],["C17",24],["D17",28],["E17",25],["F17",31],["G17",31],["H17",31],["I17",31],["J17",31],["K17",31],["L17",25],["M17",31],["N17",31],["O17",31],["P17",31],["Q17",31],["R17",31],["S17",31],["T17",31],["U17",29],["V17",29],["W17",29],["B18",27],["C18",24],["D18",25],["E18",25],["F18",28],["G18",28],["H18",28],["I18",28],["J18",28],["K18",28],["L18",25],["M18",28],["N18",28],["O18",28],["P18",28],["Q18",28],["R18",28],["S18",28],["T18",28],["U18",29],["V18",29],["W18",29],["B19",30],["C19",24],["D19",28],["E19",25],["F19",31],["G19",31],["H19",31],["I19",31],["J19",31],["K19",31],["L19",25],["M19",31],["N19",31],["O19",31],["P19",31],["Q19",31],["R19",31],["S19",31],["T19",31],["U19",29],["V19",29],["W19",29],["B20",27],["C20",24],["D20",28],["E20",25],["F20",31],["G20",28],["H20",28],["I20",28],["J20",28],["K20",28],["L20",25],["M20",28],["N20",28],["O20",28],["P20",28],["Q20",28],["R20",28],["S20",28],["T20",28],["U20",29],["V20",29],["W20",29],["B21",30],["C21",24],["D21",25],["E21",25],["F21",31],["G21",30],["H21",31],["I21",31],["J21",31],["K21",31],["L21",25],["M21",31],["N21",31],["O21",31],["P21",31],["Q21",31],["R21",31],["S21",31],["T21",31],["U21",29],["V21",29],["W21",29],["B22",27],["C22",24],["D22",28],["E22",28],["F22",32],["G22",28],["H22",28],["I22",28],["J22",28],["K22",28],["L22",28],["M22",28],["N22",28],["O22",28],["P22",28],["Q22",28],["R22",28],["S22",28],["T22",28],["U22",29],["V22",29],["W22",29],["B23",30],["C23",24],["D23",31],["E23",31],["F23",31],["G23",31],["H23",31],["I23",31],["J23",31],["K23",31],["L23",31],["M23",31],["N23",31],["O23",31],["P23",31],["Q23",31],["R23",31],["S23",31],["T23",31],["U23",29],["V23",29],["W23",29],["B24",27],["C24",33],["D24",28],["E24",28],["F24",32],["G24",28],["H24",28],["I24",28],["J24",28],["K24",28],["L24",28],["M24",28],["N24",28],["O24",28],["P24",28],["Q24",28],["R24",28],["S24",28],["T24",28],["U24",29],["V24",29],["W24",29],["B25",30],["C25",34],["D25",31],["E25",31],["F25",31],["G25",31],["H25",31],["I25",31],["J25",31],["K25",31],["L25",31],["M25",31],["N25",31],["O25",31],["P25",31],["Q25",31],["R25",31],["S25",31],["T25",31],["U25",29],["V25",29],["W25",29],["B26",27],["C26",33],["D26",28],["E26",28],["F26",32],["G26",28],["H26",28],["I26",28],["J26",28],["K26",28],["L26",28],["M26",28],["N26",28],["O26",28],["P26",28],["Q26",28],["R26",28],["S26",28],["T26",28],["U26",29],["V26",29],["W26",29],["B27",30],["C27",34],["D27",31],["E27",31],["F27",31],["G27",31],["H27",31],["I27",31],["J27",31],["K27",31],["L27",31],["M27",31],["N27",31],["O27",31],["P27",31],["Q27",31],["R27",31],["S27",31],["T27",31],["U27",29],["V27",29],["W27",29],["B28",27],["C28",33],["D28",28],["E28",28],["F28",32],["G28",28],["H28",28],["I28",28],["J28",28],["K28",28],["L28",28],["M28",28],["N28",28],["O28",28],["P28",28],["Q28",28],["R28",28],["S28",28],["T28",28],["U28",29],["V28",29],["W28",29],["B29",35],["C29",36],["D29",37],["E29",37],["F29",38],["G29",37],["H29",37],["I29",37],["J29",37],["K29",37],["L29",37],["M29",37],["N29",37],["O29",37],["P29",37],["Q29",37],["R29",37],["S29",37],["T29",37],["U29",39],["V29",40],["W29",41],["F30",42],["G30",43],["H30",43],["I30",43],["J30",43],["K30",43],["L30",43],["M30",43],["N30",43],["O30",43],["P30",43],["Q30",43],["R30",43],["S30",43],["T30",43],["U30",44],["V30",45],["W30",46],["B31",47,"Please indicate receipt number on actual receipt, for proper referencing, and list in chronological order."],["S31",48,"Subtotal"],["U31",49],["V31",50],["W31",51],["S32",52,"Advances"],["U32",53],["B33",54,"*Please report one currency per report."],["S33",52,"Total"],["U33",55],["B35",56],["C35",57,"Internal Use Only"],["D35",58],["E35",59],["F35",59],["G35",59],["H35",59],["I35",59],["J35",59],["K35",60],["M35",61,"Per Diem Calculator\n(based on above noted Trip Destination)"],["N35",58],["O35",58],["P35",58],["Q35",62],["B36",63],["C36",64],["D36",64],["E36",64],["F36",65],["G36",66],["H36",67],["I36",67],["J36",64],["K36",68],["M36",69],["Q36",70],["B37",63,"A/C"],["C37",71],["D37",64],["E37",65,"Amount"],["F37",71],["G37",64],["H37",65,"P.J."],["I37",71],["J37",71],["K37",68],["M37",72],["N37",73],["O37",74,"USD$"],["P37",75,"Local Currency"],["Q37",70],["S37",76,"Signature"],["T37",77],["U37",77],["B38",63,"A/C"],["C38",78],["D38",64],["E38",65,"Amount"],["F38",78],["G38",64],["H38",65],["I38",64],["J38",64],["K38",68],["M38",79,"Per Diam - Full Day"],["N38",73],["O38",80,100],["P38",81,100],["Q38",70],["B39",63,"A/C"],["C39",78],["D39",64],["E39",65,"Amount"],["F39",78],["G39",64],["H39",65,"Cheque #"],["I39",71],["J39",71],["K39",68],["M39",79,"Per Diam - Partial Day"],["N39",82],["O39",80,50],["P39",81,50],["Q39",70],["S39",76,"Approved"],["T39",77],["U39",77],["B40",63,"A/C"],["C40",78],["D40",64],["E40",65,"Amount"],["F40",78],["G40",64],["H40",65],["I40",64],["J40",64],["K40",68],["M40",83],["N40",82],["O40",82],["P40",82],["Q40",84],["B41",63,"A/C"],["C41",78],["D41",64],["E41",65,"Amount"],["F41",78],["G41",64],["H41",65,"Date Paid"],["I41",71],["J41",71],["K41",68],["M41",83],["N41",82],["O41",82],["P41",82],["Q41",84],["S41",76,"Date"],["T41",77],["U41",77]],"merges":["N11:P11","C34:D34","B31:E32","N5:Q5","M35:Q36","P39:Q39","N10:P10","P38:Q38","N4:Q4","P37:Q37","V13:W13","N6:P6","C35:D35"]}};
const TPL = { itemized: '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', perdiem: 'UEsDBAoAAAAIAAAAIQA68MuriwEAABwHAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbMxVzUoDMRC+C77Dkqt001YRkW49VD2qYH2AmEy7odkkZKbavr2zsRaR/lAs6GWXTTLfz2xmZnCzaFzxBglt8JXolV1RgNfBWD+txMv4vnMlCiTljXLBQyWWgOJmeHoyGC8jYMHRHitRE8VrKVHX0CgsQwTPO5OQGkX8maYyKj1TU5D9bvdS6uAJPHWoxRDDwS1M1NxRcbfg5U8lr9aLYvR5rqWqhIrRWa2Ihco3b36QdMJkYjWYoOcNQ5cYEyiDNQA1rozJMmN6BiI2hkJu5Ezg8DDSlauSI7MwrG3EM7a+haHd2e5qFffIvyNZA8WTSvSgGvYuF06+hzR7DWFW7gY5NDU5RWWjrP/SvYM/H0aZX70jC2n9ZeADdfT/iY7zf6Lj4o90ENc+yPz8/dXIMHsuAtLSAR67HDLoPuZaJTDPxF1lenQB37H36NDK6VHNpXvkJKxxd/Fzq31KISJ38wSHC/hqnW10JzIQJLKwbp6bmtCakUfBrx1DO2sMmA3cMs+24QcAAAD//wMAUEsDBAoAAAAIAAAAIQC1VTAj9AAAAEwCAAALAAAAX3JlbHMvLnJlbHOskk1PwzAMhu9I/IfI99XdkBBCS3dBSLshVH6ASdwPtY2jJBvdvyccEFQagwNHf71+/Mrb3TyN6sgh9uI0rIsSFDsjtnethpf6cXUHKiZylkZxrOHEEXbV9dX2mUdKeSh2vY8qq7iooUvJ3yNG0/FEsRDPLlcaCROlHIYWPZmBWsZNWd5i+K4B1UJT7a2GsLc3oOqTz5t/15am6Q0/iDlM7NKZFchzYmfZrnzIbCH1+RpVU2g5abBinnI6InlfZGzA80SbvxP9fC1OnMhSIjQS+DLPR8cloPV/WrQ08cudecQ3CcOryPDJgosfqN4BAAD//wMAUEsDBAoAAAAIAPcjWV2Mu1TKZQMAADEJAAAPAAAAeGwvd29ya2Jvb2sueG1srVVRb6M4EH4/6f4DhyLt3QMFE0gANVmRANpIzSpqs+3dU+WC01gFjIxpqFb97zcmISFtV0K9Q4nJ2ONvvm9m7Fx+rbNUeSa8pCyfqOjCUBWSxyyh+eNE/bGONEdVSoHzBKcsJxP1hZTq1+nvv13uGH96YOxJAYC8nKhbIQpP18t4SzJcXrCC5LCyYTzDAkz+qJcFJzgpt4SILNVNwxjpGaa5ukfweB8MttnQmAQsrjKSiz0IJykWQL/c0qJs0bK4D1yG+VNVaDHLCoB4oCkVLw2oqmSxt3jMGccPKciuka3UHD4j+CIDBrONBEvvQmU05qxkG3EB0AfS7/QjQ0foLAX1+xz0Q7IgCc9U1vAENfok1uiINTqBIeM/oyHjBGd+Es0+opnq9HJDU3K7b10FF8V3nMlKpaqS4lKECRUkmahjMNmOnCZAFa+KWUVTMEx3bNqqPj2284qDUXOvjbMSXIHfi+AKMG/wM0QAHcmhARcA4dz/RL4b+GN/prmOb2iWiyzNsVxHc0I0R7Yd+aYdvaqye7yY4UpsD6wl5kS1xh8sLXHdriDDq2hyiv/TODzaB0P7vEpRUtAtJbvypE+aSn1H84TtQL4zckDOS2tryARz11h3NBFbmSHDOs59I/RxC5SRPZaOUEhJ7Q2lYM8mgqcZzijpHU5NYdu3kjflC2s4pSWBnBeMC7h75JpMM5w37slYfJEgidTdtSJcCSjJlD9/3ASDvzrbrM4289fblrQmiTKvOIfb76ULYHcAhm8BWrYBKWNOi+YW6uwddvZajfpWckI2NCeJbNlz6wB8X6d5drHiNBf3PhwC2cQxTm9O2Zh++SX7L38M/AHyBosBGl3qHfDPREJnkZr0tvjfBmj4Bl8/FwZA8Yor8tVgucgwXZkIUourUjRvpeIUOghZhj82XEszwqGtWY5rwhkamtrcCszQHodBOLNf/887F445sr3TuVfiLeZizXH8BH9+12QzwyWR+mXdgGeX7Mx2ZsYQKFoRijQLuYY2m40szQ6ioT1GwTzcH/g9WSl/80m+jt7sJlhUHP56gXRje3KMDrPHyYPbobJnAbzrQArp4XgD6lPS0zm67ek4/75cL3v6XoXr+7uor7O/nAV+f3//+tr/Zx3+3YbQP0zovuB626Z62ybTfwFQSwMECgAAAAgAAAAhAGz7WUwaAQAA5gQAABoAAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc7yUz2qEMBDG74W+g8y9Rt3tdikb99BS2Gu7fYAQRyOriWTSP759g1CtsKQX8RKYGfJ9P2YyORy/2yb6REu10RzSOIEItTRFrSsO7+eXuz1E5IQuRGM0cuiR4Jjf3hxesRHOXyJVdxR5FU0clHPdI2MkFbaCYtOh9pXS2FY4H9qKdUJeRIUsS5Ids381IJ9pRqeCgz0V3v/cd975f21TlrXEZyM/WtTuigWTopFPStTaiwpboeMwpmJPCuw6xGZJiC9jL6QQ3QQxpogNlU0I5mFJGFLCYvHmrB84TUCzdAgmW7kzWQgmXRkmDcHsFh2T6xu/eeOrpSEO2d8vae/8PuPkPoRsOIMt2K48j+1vQ9jsd8p/AAAA//8DAFBLAwQKAAAACAD3I1ldE9NJ+V8TAABZkAAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbM1daW/jSJL9vsD+B41QQFfv2pZ4k4LtQdm6D4vUYWM/qmS6LJQkaii57JpB//dNkplkMiN1hQnMFLp9PMZ7JCMin5JUmrr++8dqWfrlh9tFsL4pK1fVcslfz4PnxfrHTXk6aV7a5dJ2N1s/z5bB2r8p//a35b/f/vd/Xb8H4c/tq+/vSkRhvb0pv+52m1qlsp2/+qvZ9irY+Guy5SUIV7Md+TX8UdluQn/2HJNWy4parZqV1WyxLicKtfAUjeDlZTH368H8beWvd4lI6C9nO3L829fFZsvUVvNT5Faz8Ofb5nIerDZE4vtiudj9jkXLpdW81vmxDsLZ9yU57w9Fn81LHyH5TyX/a2w3MQ72tFrMw2AbvOyuiDI9Znj6TsWpzOapEjz/k2QUnSTg1yIqYCalIrWMVEvNxDSkmJmKRekKa2+L55vyv6r03yX5X7lkPyVf2L+/yrfXsZAb3l5vZj/8sb+bbtyw9LLYTQKXAKRXy5Xb60oa9bwgDRHtqxT6Lzflb0rtSanqUUwc8rjw37fcz6Xta/DeChfP/cXaJ91L+n43+z72l/585z9H6qV/BsFqPJ9F1bf4Xx+i/lkmYDQKvgfBz0iy8xzJkH3EItGRzMi3X/69vyTR/6eSJGz/ER9c9HN68BGV/5kdZTNuU3LOz/7L7G25uw+WT4vn3Ss5Nv1KVw3LVlSjzLaOgve2v/jxuiObCTp/2+6CVYqQ9Ed9Wnv+Xfe3czJwyJFeqdExzIPlNv5aWi3WceRq9hF/f092Vr0yrKoW72q7+x0lI5Vnh0N1EgWVKqipgqJwh3uShkY1tExDv1L0qnmygk4V9FRBVc5TMKiCkSrYV7Zh6KZt5SS++9tdc5Ek+YCcSeVMPi1nHZDFElvNJKrSQzpUHVZgNauwYp6tkhZZ5bJz1tmorMaqxmfkzF5jZVZMzdb5ZpE0XDTgkm6Ph1d9tpvdXofBeymMa7fdzKJXMaUWHVA8aMyrkwcSOaZI5lukQ6K02Hdi6C6BMuBeBOoi0BCBpgi0RKAtAh0R6IpAjx2rkUJ9GqOkyIAiaoo8MJqZQkOo5AIlDyiNADKG2hMITbkzqZD6pUVUhSJuYygpYGKmcQGjOprVK+uk4ipccdXkUMgLxU15S9Bft9Xryq+oq1idkgiNi1DyES0WkRZOBDoi0BWBngj0RWAgAg8ckEuZJuv76tl9f5dkW8tKOU0QE+xRl+3Rjquxe13Mf94Fe3ensd319Vjc5hOt5hM9oCFZvz/otJPsrHEh5ELIg9BU33N2huTsIpMC2Tz5XO+MJLVZMe8pwjmIAQZJA0JNwGtRJBu3HUjrQqgHob4BS6IJJTFASZiOk5UEQi6EPAiN6LlkhzSmiJWZCUCmxp5CmtI2lY8CI62VKWb4HiB1gDQA0gRICyBtgHQA0jdhUQyhKCYoSoKQF3OOZeZZwywmrRKEPKqdtdfIBEUyQZEAMjX3FMlCFckCRQJIHSANgDQB0gJIGyAdgPQtWCRLKJIFikQR7kUYIC5APIpkqR1ZoCAWKAhAptaegtiogtigIACpA6QBkCZAWgBpA6QDkL4NC2ILBbFBQWyW2ozkCIPGFrPvAsQDyMgGFbJBhQAytfdUyEFVyAEVAkgdIA2ANAHSAkgbIB2A9B1WoXTG44CCOGImhwBxAeIBZOSA/Dsg/wCZOnvyr1SlM4QTZ6O5osRS+ZkBg/iLCwA1INSEUAtCbQj1KZQbLIowLR6wIK46FFK4K4ShBHMlmMfkuHRTSJJv6ZWdc/IMl0t3ctnBzQLvGcSnG16vNCRYC6q1oVpHwuxTLJ9xRcy4AjOuSDIOMVeCeUyOGxbsaLMZ2FhytBMJNqVYMlPIV0u8hENeh98pKiyWCoulSooFsRZUa0O1joTZh8wBgxyuNJDpQqYHmSMIjSViEwk2pZisCtKrQkwVuItAWgQRqQOkAZAmQFoAaQOkA5AuQHoA6QNkAJAHgAwB4gLEA8gIIGOATAAyBcgjRRTd5D1BuCJ+4qJAxWVX5YZy9t0vdqWc+cQdxWybPzThyvCeEXNBej6ozoIcPki4nGlIg4Srl6Y0SJhzt2iQmgsS5oFtaZAw7+vIglThNbIrDRJsvScNEurclwaJ1+LSICHjD9IgIeNDaZCQcVcaJGTckwYJGR9Jg4SMj2VBmpDxiTRIyPiUBmn8xbAmZPyRBln85F/TxOEnC8oynh+PsvtIKAdO7m+oVc6CE0jXOA9OIIvzYBFpAqSVIvH57EKy05f4x9dZ6D+Xk7fhSFStF6V4u4jfHOs0v34h+7tpfVH0iy9E9aJc/vO68hJlQxxbR/QTxQpkdtDMLprZQzP7ILODkzJLomoTllkly+zgaGYfTjlWRXasQzTTRTM9NHOEZo7RzAmo5pSNQUVaRrK5NmVlJAN3PB18jQYNEWLVq4p2wwmCrU+53d3+L9G/fIxeJgWpvN9Ib3di/Ca5VaeqnN+Y0G/ojUHOb0zgN2JMK0XOHWFtNLODZnbRzB6a2QdZHJyiJe3jBzRziGa6aKaHZo7QzDGaOQG9PWXjRpOJqIkIsAGOI7EBXjGyAZPYgHnEBrIb6urnbCC5Qazy73pb0AYsYAMWsIEEcTgbYMj5NoBldtDMLprZQzP7IIuDU7T22ACWOUQzXTTTQzNHaOYYzZygmVM2vs6yC44jsQteMbILi9iFdcQusrd7PmkXNpw12NAubHCVIiJNivCzBoacbxdYZgfN7KKZPTSzD7I4OEVrj11gmUM000UzPTRzhGaO0cwJmjll4+ssu+A4ErvYpxhf05DNtSd2TUNCiJ3YxE7sI3aSvTf5STtx4OzDgXbigNmHA+zEAbMPhpxvJ1hmB83sopk9NLMPsjg4RWuPnWCZQzTTRTM9NHOEZo7RzAmaOWXj6yw74TgSOzmkqImK+UWf2Rvqn3MNtQomIRTiXYNCnGtQhHMNinCukbLOdg00s4NmdtHMHprZB1kcnKIldw00c4hmumimh2aO0MwxmjlBM6dsfJ3jGjwHusZBxSOukS0L+aRrKGCuQaGcayjipQtAmhThXSPVPt82mNj5toFldtHMHprZB2kcnKK1xzawzCGa6aKZHpo5QjPHaOYEzZyyQXCWbXAciW0cUjxiG9n6pE/ahgonGyq0DRVMNkSkSRGlyvkGCzrfNrDMDprZRTN7aGZfxozeQB2Ovn4hWb/5o/Gx8ddbvxQVL1xs4j8u/uNvX759US+OBGh/XnwhRdn75uvglKPeY1BY5hDNdNFMD80coZljNHOCZk7ZUD7LoDiOxKAOKR4xqGzp3icNSoPzGg0alCbMWRoAaQKklSLn+xOW2UEzu2hmD83sy5iZP2nH/OlQQOJP2gF/OuGo9/gTljlEM10000MzR2jmGM2coJlTNpLP8ieOI/GnQ4pH/ClbaPpJf9LhBCqBdG6BN4X4CZSINCmSm0CxoPMNCsvsoJldNLOHZvZlzMyg9GMGdSggMSj9gEGdcNR7DArLHKKZLprpoZkjNHOMZk7QzCkbymcZFMeRGNQhxSMGla28/aRBGXACRVfeGpxBGWACJSJNgLRS5Hx/wjI7aGYXzeyhmX0ZM/Mn45g/HQpI/Gn/6trBKUe9x5+wzCGa6aKZHpo5QjPHaOYEzZyykXyWP3EciT8dUjziT9lK3U/6E1ypS6HcBAqs1AVIkyK5CRR6qS6a2UEzu2hmD83sy5iZQZnHDOpQQGJQ5gGDQi8KRjOHaKaLZnpo5gjNHKOZEzRzqiIWD6sHFw8fVDxiUEWtIVbhGmIK5SZQ4vrgBkCaAGmp6DXEaGYHzeyimT00sy9jZv5kHfOnQwGJP1kH/Am9WhnNHKKZLprpoZkjNHOMZk7QzKmKWK2sHlytfFDxiD8VtWhZhYuWKZSbQIkLkhsAaVIkN4FCr1pGMztoZhfN7KGZfRkzMyj7mEEdCkgMyj5gUOj10WjmEM100UwPzRyhmWM0c4JmTtlQPsugDq6PPqh4xKCKWgat0kWVBmdQdBk09/wNCmkK51AAajIt7hEcWdT5HoWmdvDULp7aw1P7UmpmVM4xozoUkBiVc8CoTjnuPU6Fpg7xVBdP9fDUEZ46xlMneOqUUhXtLMeiY9iSOxa1But8x9IKWoJd1+jDvriHAUGoyaDMnloMAgefPINCq9Ye4pBF9PzZ9E/siYXt+RP79l7BREKW3w6C00VweghOH8EZIDgPCM7wcPHI5tqYFc9IijckxRvuLZ578CAM6UF4CM4o47BGHCNkJofPf8LO3UzOfZI89mPPuU+pmJ5dXjxSyMguL54YFA+h/FguamG0xh4jRy8YY9PRhEf+3HNR6YxEgjUk2JhhKr8DW0wue/5cyptSiEhFr8RRTukzOPY9b4MSDDUlPBLC417CEyNoKeGJEJ5khHzyi1peqqkgXfcSrC7BGhJszLDc050dMdUqTDXTgn2WW6imfOJUk8UoFt9melVsMxpkc6cOoAaExhTKn7gqnrgGT5xCRtwBX0nPXZJkHCu/LsuJevqzQcvp+dI1LbrFnXAOy+/YkO34/FIkb2sZfNPRB3XrNpdA8cl0dS4qKwZ9MnfmWk0ItSDUhlAHQl0I9RiUzSv67IyyGzoDdqwG/0QwXRFfB1kU97BNCeZKMC/FVFgoUyjU4XrQ52Zzd6gYxK3hhFCDQdwDYhlkcLmnEPcQRgZZXO4B1IXyPQbZXO5NmHv6TqPBfbJBiulcpiHmSjAvxQyYaatczFi80yxWBa5fVNGgaBDvzRasi8WKwA0m4SW1CaVaUKotk9I1cUZLHyTCPUITQj0mxdfOgrWz6Ks191EiKaZxtaMYuyxKjkwXp3g0Stf5KEOc1LGorGvH7ND4x/DppujoNIh76mYOyreKXVir2Ke0Cn1cQ5VrFRu2in1KqwCpFpRqZ1LZoAZRXQj1GMQ3hg0bg979zj9i0RAN1Za0CmOq9J5KYzQajr4+9ofD3tT9+mBf/OH6Yam+8Felr9Nx/cuff/ztjlz2KcqFedH81h83/rxQqlX2qkx+FLuM7kBPdiAXHiw+/OfS/VsY+uv572QXbUW/sOgu9ql7qbrGdSfNjw27zCmsy5xTusyBXebALnNO6TIg1YJSbZmUbomG5EBDAlCPSXEPXdYcSZPptthkNErlX0ucXJONhtOH+lfSev9TvTIuFFZdA7SOk2udhOYeo3kpje8JR+JYYPLtQMfiofxn8FSL6iW9ekIv0SC+lxiP6yUGHewlKNWCUu1MKnUsGNWFUI9BXOdQSOFufT+kGNcnEsyVYF6Kca9JFJOMel0prFLKKZVSYKUUWCnllEoBqRaUasukxEHRYUEOVzsA9RjE106R1E6R1A5irgTzUoyvnQJHp/jo6gkLynjTHJSvuVpYzZPLbyu7uLhnkMpVGEANCDUh1IJQG0IdCHUh1KNQrnqqpHqqpHoQcyWYl2KSlEvvRqBSTu8hcB/KwSBuVQCEGhBqQqgFoTaEOhDqQqjHIINLOb1toVpcyhnGf24axFwJ5qWYA1NewM2OvKD0JsZnBMWL7U8LFnBNmRcs4MojL+h8XiO6MfJpjQLOxVAL0NAK0NAL0DAK0DAL0LAK0LAL0CigT80C+tQsoE/NAvrULKBPzQL61CygT80C+tQsoE/NAvrULKBPrQL61CqgT60C+tQqoE+tAvrUKqBPrQL61CqgT60C+tQqoE/tAvrULqBP7QL61C6gT+0C+tQuoE/tAvrULqBP7QL61C6gT50C+tQpoE+dAvrUKaBPnQL61CmgT50C+tQpoE+dAvrUKaBPlWoBjapUC+hUpVpAqyrVAnpVqX6mWSvbV9/f1We72e31yg9/+Pf+crktzYO3KFKJVuukcLL4ytXsmpd8BCPY4tS85GMXwRar5iWfgCdseVS02lOySkTYcq/ptXryWZJgi1GrJx/QLmy505RatFgHbhkQjpd81KOw5UGvebK9PBCCbB8PZs2V6ijVmpv8vQrYotTcZGlmJcvx7fUzyfrjbLkg36Ply2nSy+Km0u73xr8pk1/8cmm2XAbvd8vZ+mdc3e1r8N5Zb952A3+7nf3wU7ARhkGYA/+RZE8xavGi94+w9rZ4vin/q0r/XZL/1Uv2U/KF/fsressmCFdvy5lyq2u6GX1sCvudbVFvdVOzrXSLSk44fyYAIGnYkAMczMIfC5KCpf8SNyjxrDBp4PjnXbCJfyLt/T3YkfZmv736s2c/jNaZl16CYJf8WEk0x/7ubVPazmdLP7ktFIQL0v/xbm/KJIHPZNvGj8IXP9ZB6D/HKdvmf2Vp66tqLV64Ts/tJlmGXBGo/seuv93F30tv4YJk9/6+YX4zDOvSse7uL/XvtnP5rX5nXtade0e7//btTqs3/yLVWC3X2xoZqzfl191uU6tUtvNXfzXbXq0W8zDYBi+7q3mwqgQvL4u5X9luQnLq8eBdLStqtepUnMpqtliTOhGR2p7e0tIdrU7bj/8x92N9c786bc/lYrv7RHue1o5K1o7RgWQt+LGqvdwe+LuBGvkSvSETx5FvIjku822dDI569NGJKZKEil38702CikrCIErC4It9LAcPdu3hPz0DGioD7SgD7eMZaJAuaJzQBRKQWAAZM7vka+wElfcg/BkP1Nv/B1BLAwQKAAAACAD3I1ldQq3KSeIEAAC6EQAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQyLnhtbJ1YbY+jNhD+Xqn/AaH70FO1gAHzpiQnXRLSW+mqVfe2/cwSk6AFnALZl1b97x2bl2BDcrmNNgQ8M8+MHz+TtTP79JpnyjMpq5QWcxVphqqQIqbbtNjN1Ydv4Y2nKlUdFdsoowWZq2+kUj8tfv5p9kLLp2pPSK0AQlHN1X1dHwJdr+I9yaNKowdSgCWhZR7V8Fju9OpQkmjLg/JMNw3D0fMoLdQGISivwaBJksZkReNjToq6ASlJFtVQf7VPD1WHlsfXwOVR+XQ83MQ0PwDEY5ql9RsHVZU8Dr7sClpGjxnM+xXZUay8lvBnwtvq0vDxUaY8jUta0aTWALmteTx9X/f1KO6RxvO/CgbZQMBzyhbwBGW+Ewv3WOYJzHonmNODMbrK4Jhu5+q/Rvu6gTe6ae5Q89i//lMXMw50Vy5mh2hH7kn9cLgrlSStv9E7GACtqvpipvde2xQEwXIpJUnm6mczuEUWc+Eef6bkpRrcK/9Qmt/HUUZ+Z2rIAM4A6TNRP1L6xFy+QLEGq4NkJGbyUiL4eCZLkoH7BkFf/N2kQsEGGbaHXedUEkMY3nfJQy4+mMmWJNExq/+gL7+RdLevoQIMLDE5Bdu3Fali0DdUoJmYocY0q/hVyVNoVFidPHrlny/ptt7Dna0h23DAW4mPVU3zv5px1EY3cVYbZ/VxCCD26XZLWPtfjLXbWLuP9TUPY9vxXHwtBm4x8CC/hl3DQubVGE6L4Zww7B8uxG1B3BOIdw2ByGgD2c2PTkFvVpELYRXV0WJW0hel5MtYHSL2LWoGDJjLwdcAr96n8dNnWnPECXVYGCQaM4zPDGSuej4EzdUKhp8XGM30Z5YX3pCqz2dN5PO009R7SZ5TZJfT4jl9g3PERpbtCOpHVs0Iws6gMNPoC+NO60knJDqFU07YFJ02bQEmJ3w4aXti0s6ZWX+X9p4Bu0lnDUuyxJKWrY898EG+6LOy27m5PXHr8VA4Htq04HhYgC2C37Y+Am94Whp4SoqOdva7qeMBNyncYQpH4qH18RoGJAmsRCuWBCJYTckaClbJuGmNPhiTxf3D11+WOAjxx5meXCLCOUvEoMcvc+J0nPTd4ZzqTBa/Lj39w+0Hty0EYc3ybAfh7irJaCUGr8RgXzMtw3X87irRJ8auhVjL04ZpbWnZQjE2FGM1oWQbexL5YvBGCHYdzReqnl4J952SdCck6UqSdC+JbiVapZZdC1ZLmngoWKWG3LgjSbpB6H7seZH6120K0Kxpgrx3EuSNCZLmuPSEtpNb1rvUlGvBiqXY0LvUst6IHy8IvY4f2KtJBLUrNE2P/056/An9SKu89C/y41/kx7/Ij3+JH3/Ejx+E/hQ/AhNs9u+iggfKXMha6ZzOkCGZZTZE84gOySzx0VkHhCAjgKDzkkEGRzI01ztDFpogy7I095pt2Yk51PzLZseLnjrHkKnrvNAZ7iT7iDzRPmZPssv0dWZzwB8C/tAF/lDLn3+m7ZC8y/yOxNrdnTHcSjkytj7YPOek3PHjWKXE9MgAGe39aHMQXFkB7K300fjaCtZT46EVhHxcP8E3Z9CvUblLi0rJSMJrh14omw0jv6/pgd+BOh5pDdvJ7mkPp2JSNqpQEkrr7kHvz7bHg1Kxwyjftyq0TIEe/pPGXM2iYgu2A+E19b+6LP4HUEsDBAoAAAAIAPcjWV1oKovXfgYAALwbAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDMueG1spVltb6M4EP5+0v0HDq2025NKMGBeoiQrbQnpttpVdd3efabEaVBDnAPSlzvdfz8bjAMDCbRbbbfEnnk8fjzPGDuTzy/JRnkiaRbT7VRFmq4qZBvRZbx9mKp3P4JzV1WyPNwuww3dkqn6SjL18+zXXybPNH3M1oTkCkPYZlN1nee78WiURWuShJlGd2TLelY0TcKcfUwfRtkuJeGycEo2I0PX7VESxlu1RBinQzDoahVHxKfRPiHbvARJySbMWfzZOt5lFVoSDYFLwvRxvzuPaLJjEPfxJs5fC1BVSaLx14ctTcP7DZv3C7LCSHlJ2T+D/ZrVMEV7a6QkjlKa0VWuMWQRc3v63sgbhZFEas9/EAyyGAFPMV/AA5TxTiwssYwDmPlOMFuCcbrS8T5eTtV/dfFzzn7ReflklB/lz3/qbFIA3aSzyS58ILckv9vdpMoqzn/QG9bAclUdzSYjabWMWULwsZSUrKbqF2P8HdncpLD4MybPWe1Z+YfS5DYKN+Q7z4YNg9NZ6vOkvqf0kZt8ZcHqPA6yIRFPLyVkf57IBdkw8wViuvi7GMpH4wXSLRc79iEkjlB/rgYPiuRjM1mSVbjf5H/Q50sSP6xzFgFmLPF0Gi9ffZJFLL9ZBJqBOWpEN1nxv5LETKhsdZLwpfj7HC/zNXuyNGTpNrNWon2W0+Svsh0J79LPFH6m9EOGhh3dRNwxy195riMDnQSxBIhVA1GVdbxcEl5DTvpi4YsPvtZQX1v42gdfU3MxtmzXwUNBHAHi1AJ4M4grQNxukBOeSBeu/EH4ejXXe5LlQZz3BYBQBYM6V7LtOiozqEhCP8zD2SSlz0papFC2C3kFN8bFWvDBPY2B5Os4evxCy2A6MtPETB4Rx/jCQRgdHnOaqhlrfprZxmT0xMcVNhfShkfDBpcRmB0RuNphGlIgx/RRRWEWI3h6QVUxZtnC1CmbfGGEZMtcGGG7Fr2hN6MPOo1Q02jRZYQBD5ciAKPFg9XBg32EiN61kaRY5XBmPSQTLI0laML19QNGvgCyajbIa9rMBRB2JLtBu2nRbroU4I0ArCb4tbBpkIulTYNK3JXUtna0wlZk4XIIpz6EDcjCgqx6HDYGZFVGDutezT7ekFTxY5Ion+5u/Q9nH3+7wL/XGr/FL2SpXOzTlL18vbLuD9cMcMWRHQQycd4H7Q+FZlMAYQd92PPB2I4DsBd92MFQbBMD6MsK2i2gb+++ffLxeIHPKgdPBx5XlYcnU/AaqyXf3RllH82o2pZxOrnsKrlkebJlKsnyJJqQfixxnB6WnGoFWA0HmdOH7Q/FZi8bDsicPuz5UGzL04DwF33YwVBsrMFifICG1dh5ZwlxOkoIIOvC6SohoM74Tm3W7Q1pDrqhkpvdGHgvQDdgpepFBz0544VzJgsHgLty2nJyyh1CA9vI94Zpg3H3nYy7bcbBvnThdhBugTTz3dOEu6cJd08T7p4k3G0T7o4X7lHCr92S3e5a5f18rfJatcpr1yqvr1Z5Pbrke1s5QcOBdPeB+8PBsevAWhj0wc8Hw5uotdX1gQdvAYehX3oyWaCC+KHiXRIqHGHVcoGIhBEoW6C2+ZUVOxMWSoRKmAMDdl6B79rAwsAtNQELE4r1UhqYB0UhnR/UK01hHabclZxgrYwJwdqmduRVk5/AflZtBUZTbqKpobeqjY1yRHBI70ssQ4pCs+tXLjqCy9Q3mP+GwVrvIkEv/Hw4vOnB9OgDD94ArnkNnnQLplo1GJYrdSVXr73Loc4D9xCNGh0ahRudMAIadaFGhRWySwnCF0XQ3zoMg36rJU/QDxmrup2aOA0mTqMSpwPmdS2ErmuOe0SGXbcIb5Wh2Zah2SFDs1eGqC+7rEoZLnwlnffC+8PhDUODm1PQiz8fjm9hKOxFL3zwBnitddST8LitrK4LFNPUnCF3WYckqC5D9LqCdKgzYYXcupUHdVZZeaXOXLjUzX7DhEvV7LdaXIP+1qtCZWDoNaVZTGlWpTRPh05XkoH6NmgJ/XlH3jkRPCD3SK06+tbvpWwEWT5YycUe1a4wE5I+FBfymRLRPR+Er6NsLb8KmJvjeXH/B9oDcxx0tS/M8aJoHx3gy28hvoXpQ7zNlA1ZFfNhlTgtb+SK55zuiid+jUvznCbVpzUJlyQt00xZUZpXH0by2439Tsn41xHs3Mle72gaM8qKL7Wm6ibcLlnfjhQxye/dZv8DUEsDBAoAAAAIAPcjWV1EaeQIigMAAL8MAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDQueG1snVdRb9owEH6ftP8QWXttEzskQESYunVVOwlpWre9u44Bq06c2QZaTfvvuySQmkCmpgiK7bt89/n8+XrMPj7l0ttybYQqUoQvA+TxgqlMFKsU/fxxczFBnrG0yKhUBU/RMzfo4/z9u9lO6Uez5tx6gFCYFK2tLRPfN2zNc2ouVckLsCyVzqmFqV75ptScZvVDufRJEMR+TkWBGoREvwZDLZeC8WvFNjkvbAOiuaQW+Ju1KM0BLWevgcupftyUF0zlJUA8CCnscw2KvJwld6tCafogYd9PeESZ96ThTeATHsLU6yeRcsG0MmppLwF5z/l0+1N/6lPWIp3u/1UweAQJ2IrqAF+gyBuxohaLvICFbwSLW7AqXTrZiCxFf4L96wI++KIZhc20ff1F81km4ISrhz3Nlym6wskCx8ifz+oIvwTfGWfsVXp8UOqxmtxBnAAgDJecVcrwKHxt+WcuZYoWU5D07xoUhgDotyju+IB+U8vlm/YyvqQbab+r3S0Xq7WF6xLBvioBJNnzNTcMFAmBL0nU0rymls5nWu08OF0McUta3RWc4LDv0fmMVc5XlXeKCNw/sBhY3s7HwczfAke297k954OPfRbnfEjr4wO3liAZRJA4iGHUYeYax2GHkmuM4vNcwkFcQgdxNOlwcY1h3OHiGqPxeS6jQVxGDiKedri4xrhjXLjG6Xkq0SAqkQNIuuJxjXEnZwvXGE3Oc4kHcYldLh2R3sa1SCeBq5rRsc/XvQ+pLldD0oWMehI2HkRy7JIkHZLjhgB2SXZ0v3ABxj3Sngyi5F5c0r1mk1NKcZfS0c3vUfh0EKWpq/AeceBgWLVzj570JA4PrKBuWkiPPvCwooePql7QgzmseGG3BpGeE8LDihB2a0nUU+/xsGqCj8pJ37kPqwrYvcMh7mD6zj9Ro7S9t9TyfT9AknqT+yZF6uytPc/Y14KtMwhCUBPmsyoyYV9ajyZU3SkcSEB/Ag/8olJkTe/pMbWpdodR1+TZ5xI6SCmMRR6VUu0+SVo8Nv3AWu3uinJjF9wYuuLt4hetlT5abDqWG9zXS5H/9FJVy7uRFM8/XH0YJfAHQ5FoF2f+MeGTBWiFSuCxoHolYKeSL+tjhFqnm0aoHltV1iNQyYOyVuWH2RryzXU1A+5Lpexh4je499xuSk9pAfKo46WohDxrKiBh8NvECkbldSmqpq46hPanx/wfUEsDBAoAAAAIAAAAIQB1PplpkwYAAIwaAAATAAAAeGwvdGhlbWUvdGhlbWUxLnhtbOxZW4vbRhR+L/Q/CL07vkmyvcQbbNlO2uwmIeuk5HFsj63JjjRGM96NCYGSPPWlUEhLXwp960MpDTTQ0Jf+mIWENv0RPTOSrZn1OJvLprQla1ik0XfOfHPO0TcXXbx0L6bOEU45YUnbrV6ouA5OxmxCklnbvTUclJquwwVKJoiyBLfdJebupd2PP7qIdkSEY+yAfcJ3UNuNhJjvlMt8DM2IX2BznMCzKUtjJOA2nZUnKToGvzEt1yqVoBwjkrhOgmJwe306JWPsDKVLd3flvE/hNhFcNoxpeiBdY8NCYSeHVYngSx7S1DlCtO1CPxN2PMT3hOtQxAU8aLsV9eeWdy+W0U5uRMUWW81uoP5yu9xgclhTfaaz0bpTz/O9oLP2rwBUbOL6jX7QD9b+FACNxzDSjIvu0++2uj0/x2qg7NLiu9fo1asGXvNf3+Dc8eXPwCtQ5t/bwA8GIUTRwCtQhvctMWnUQs/AK1CGDzbwjUqn5zUMvAJFlCSHG+iKH9TD1WjXkCmjV6zwlu8NGrXceYGCalhXl+xiyhKxrdZidJelAwBIIEWCJI5YzvEUjaGKQ0TJKCXOHplFUHhzlDAOzZVaZVCpw3/589SVigjawUizlryACd9oknwcPk7JXLTdT8Grq0GeP3t28vDpycNfTx49Onn4c963cmXYXUHJTLd7+cNXf333ufPnL9+/fPx11vVpPNfxL3764sVvv7/KPYy4CMXzb568ePrk+bdf/vHjY4v3TopGOnxIYsyda/jYucliGKCFPx6lb2YxjBAxLFAEvi2u+yIygNeWiNpwXWyG8HYKKmMDXl7cNbgeROlCEEvPV6PYAO4zRrsstQbgquxLi/BwkczsnacLHXcToSNb3yFKjAT3F3OQV2JzGUbYoHmDokSgGU6wcOQzdoixZXR3CDHiuk/GKeNsKpw7xOkiYg3JkIyMQiqMrpAY8rK0EYRUG7HZv+10GbWNuoePTCS8FohayA8xNcJ4GS0Eim0uhyimesD3kIhsJA+W6VjH9bmATM8wZU5/gjm32VxPYbxa0q+CwtjTvk+XsYlMBTm0+dxDjOnIHjsMIxTPrZxJEunYT/ghlChybjBhg+8z8w2R95AHlGxN922CjXSfLQS3QFx1SkWByCeL1JLLy5iZ7+OSThFWKgPab0h6TJIz9f2Usvv/jLLbNfocNN3u+F3UvJMS6zt15ZSGb8P9B5W7hxbJDQwvy+bM9UG4Pwi3+78X7m3v8vnLdaHQIN7FWl2t3OOtC/cpofRALCne42rtzmFemgygUW0q1M5yvZGbR3CZbxMM3CxFysZJmfiMiOggQnNY4FfVNnTGc9cz7swZh3W/alYbYnzKt9o9LOJ9Nsn2q9Wq3Jtm4sGRKNor/rod9hoiQweNYg+2dq92tTO1V14RkLZvQkLrzCRRt5BorBohC68ioUZ2LixaFhZN6X6VqlUW16EAauuswMLJgeVW2/W97BwAtlSI4onMU3YksMquTM65ZnpbMKleAbCKWFVAkemW5Lp1eHJ0Wam9RqYNElq5mSS0MozQBOfVqR+cnGeuW0VKDXoyFKu3oaDRaL6PXEsROaUNNNGVgibOcdsN6j6cjY3RvO1OYd8Pl/EcaofLBS+iMzg8G4s0e+HfRlnmKRc9xKMs4Ep0MjWIicCpQ0ncduXw19VAE6Uhilu1BoLwryXXAln5t5GDpJtJxtMpHgs97VqLjHR2CwqfaYX1qTJ/e7C0ZAtI90E0OXZGdJHeRFBifqMqAzghHI5/qlk0JwTOM9dCVtTfqYkpl139QFHVUNaO6DxC+Yyii3kGVyK6pqPu1jHQ7vIxQ0A3QziayQn2nWfds6dqGTlNNIs501AVOWvaxfT9TfIaq2ISNVhl0q22DbzQutZK66BQrbPEGbPua0wIGrWiM4OaZLwpw1Kz81aT2jkuCLRIBFvitp4jrJF425kf7E5XrZwgVutKVfjqw4f+bYKN7oJ49OAUeEEFV6mELw8pgkVfdo6cyQa8IvdEvkaEK2eRkrZ7v+J3vLDmh6VK0++XvLpXKTX9Tr3U8f16te9XK71u7QFMLCKKq3720WUAB1F0mX96Ue0bn1/i1VnbhTGLy0x9Xikr4urzS7W2/fOLQ0B07ge1Qave6galVr0zKHm9brPUCoNuqReEjd6gF/rN1uCB6xwpsNeph17Qb5aCahiWvKAi6TdbpYZXq3W8RqfZ9zoP8mUMjDyTjzwWEF7Fa/dvAAAA//8DAFBLAwQKAAAACAAAACEAJml2DhwPAABklgAADQAAAHhsL3N0eWxlcy54bWzcHdlu5MbxPUD+gZg1grURiuRcmtG1h7QDGHAMI7sBAqwWAjXDkQjzkDnUWnLgl/xKkLf8QB7ykk/Jl6S6eXWTbLK72ZzhWgKkGZJdXV13VR88e/Xke9pnJ9q5YXA+so7MkeYE63DjBnfno798WOmLkbaL7WBje2HgnI+end3o1cXvf3e2i5895/2948QagAh256P7OH44MYzd+t7x7d1R+OAEcGcbRr4dw9foztg9RI692aFGvmeMTXNu+LYbjBIIJ/6aB4hvRz8+Pujr0H+wY/fW9dz4GcMaaf765Nu7IIzsWw9QfbKm9lp7subRWHuKsk7w1Uo/vruOwl24jY8ArhFut+7aqaK7NJaGvS4gAWQ5SNbMMMfU2J8iSUhTI3I+u4h9o4uz4NFf+fFOW4ePQQzsHOfXtOTWt5vz0fFIS5hyGW6ATH/46TGMT79K/r3444sX5pFp3nx9ev2y9s711yMj64gACmLCA/Tjn53NJzHI0ykN+obG6xuNwLly7/pldvf669PK3WSAevLv1SsY9M3L1zf1A5xOymiUev5GK3X2jSYC35qXxvnxK31qLj9trnXf96/15+fT17WUt+YzGjPf2BjP8HN6ynh+XhqJ9vGr//5TX5jTT8SQtNMb8vq1npO5dKc8SHT79Y3G6LskfDl3oK///f0/+tRafmK0LEkYev7f+nQ6+3SdS8ApFq+6OwyYyxIl9IIA1wRGN/rpNfvWDdwqEaHU+EZ/faPXo3AMBpdUnBsdmPEPYMaSZAbqv/469XyZFfppU89WWaAR4f6lj4GgJdEmb5SEnLzVIO5GapkuzrZhUBgopNvYIJ/8GIQ/Byt0D8wWWC302MXZ7hfts+3BFQtRbx16YaTF4F7AbOErge07yROXtufeRi56bGv7rvecXB6jC9gjpc/5LvgHdNFIekj+3sIFFz2Z9neM2xXQ30Su7dXCpsDk6JqY2TlynM0RFhmIyVwKBI1BQrDo7vZ8tFqZ+EcB1IIsH+z70Lfb6UKSdkFjwAuCpM2yEIZ0bAsT/cpBbiDZBP90R9jCqFHc6AI6w7hKB1UIVyGv8I9yCl+a6FeewqRk7cNIUKQXV4Ss+XhaEeE31nRhHXcjMGZbN/WsEdVjc2K+kbNouW6V7Cmv1tPtm+y/jB2B8BiFsrmZloJRVe0OhrbZytUxQpiSPXvSOo41OCBe9B8J15iwrdW3iTinKnh53e5mhurjCWwuhMMRJE3IQFKjIyxPX5FULgOTipXrqBuUuVcOvQHvOscqGhRifKWYSCMmLQcNutlhfJmUCcZRUtRrDaE4oe4zbKD6wh5HhR/Lqd1qz2WC9HYbJmW4leFaa9kU0BZb3x2kkK7n0VU0dOXiDCqOsRMFK/iipZ8/PD9ANhpAcRQZOyN5ruXpu8h+tsYz/ga70HM3KCu+u8Q5cOpRi6D8lnXDIFDmRY/V29Vq/g5HqOXe8hsKe3v3Bv0iEpV6K24o7K2Ivku9FTcU9lZkPaXeihsqekv9OxQuYxeVg82jyXK5PJ7NFjNrOYZS2xgrZK8jTnGAsl+GwzHgsLDmi8ViOZ1Y0ylW2wwHN9g4Tw4UqaEaitRJnfReXl7N3+Fgvf++qnrZw7iqlJ0BZZeTxXI+BgKb0wU2MCKjxdYLzN9tGG1gSiibRpguwfQk1y7OPGcbA2ci9+4e/Y/DB6SiYRzDvMnF2ca178LA9hDvshYcLWGKCWaTzke+s3EffegtcZFlqiXdiPbCCRxGkg1kL+jE9zDzVRkpLo8ZNbg0Pc5Ll2xc9bBSlUMMrucvV3NRHnEBxdJGC1svyJQEurmPhFWdaJ/6ccLsE9Sv7b3aoqBNU4OiQkoKF4fGcmLRF95XS/SLfUGbUqSkIVqo4A1BOEHNqNSmwSIiM9luv/ZA89xocwpNN9NLGZwqXQjOCvgQYf0QcVScZOEUe0KI+NSVsAicYk+06E/sOanCa64Va0g5XKjoK5fPEBNGcTlJfMyeUSGMIqfIEi1aRLZMdk6BJXSi55hhX7SWk79ezWEZpUMEC53IcnD/LxCbyRH7cKZ+X4yRTeMOHgYNGPEm2gjojNoMuzGvlAvyhDKyNIPtKx3m8iPK47s+hJArqZFNDhvMinD8KOq6FWczirIAQcewv4CKi7x95Tj1JQkulPac4aiMovofX6tblynYCto++Zpw1lFLKZi7QiroE+jSthLz09WAt1CCmeXyU1C4cC/OJIm6Tgv+VUerdMCcQ2yvCZawStM9C//guqZcaa1SwFPeDycFGoo9ylDqzIw+xU+mrCiq023c7hrHK+f1gVOn3lNxkfGlM6Ewsbp2PO89mur867aYXYVJwKctsZUK7wgJYrRVC32EtSbpx2QiNfkCAsFqhPYR8TVK9jQlXY3R/qb6Zpr98OA9o80ZGKPkGzxafHuLJ4yL72889y7wHbLBD1EYO+sYbzPE0/AU+skmrwNhYpBsSZhE8MeaLaQ4pD1tW1mFtuAwaJ61JomPl2uw2D5WCKtBFurxSrAk2I728MCWnEQKtPswcn8B+UF7eZDHHKEtp7G7Rt/XICZOsiXnacuWarTJLSUVjJRUhZTQQEtCTvNvWE6zb0wEhdFhK1mOToOKEoMBFecYTBkWqS8EMOBbAQzW3CTMykb//aN/60QrvCEXbaBqp1em1630IxncxFAG3hQRYKOfON77wpSisBSmaPFgQf194U3pzBDxJrweSztg4X+jriunJYET2ilaZ6lhpax6nHBIjXODJovIQgmwpvUn8dxCOtyAAY8KW6Amw9VhsN2FlbTQFlTsqQdkJjmUQQWXJSw1TbsKEgNwMQTtkHJmWgtGhWA6bIFv0hF1Nlo80GEjXXHotGIfEmlWDGKBkdoPoSFCMirWkmGrKCEeD1yIWd4QFm/v1xtyEbPioodlEVhy2kbMnoO2entPxZooPx+eJtEoDtGV8kgtSMWQQwAUTSkrE6B4JwMGDoXwiQd0L9rPkf3wwXlCZxa1xr3sEVTymgM7SJ4sHbaBDVv4hGsVLbWgotQCc3itzEbnBTVWyMpljIaqCzpBSBUsYbxEK2S18QzhJ4QHI4BAQ/aXnjaVVGq5ceAJAviLh22kgTMsOjIadjzBqUxKB1mWS2zF0i64VayZjg2ij478EhL9vRZ0+Wqg3HalKa1Nj1lLWGsRZBl86ZSJ+QCLp3xUHmIZkg/zQTptrvxs4KVfVOLNDBUoZxGdfgF1hAqKAyuGsUg7aSkl7i/3ZXJ/0lLrOMycClVGmgyx8sFjEiZStfo9CkXrPAfILzXz2xAHWayQNS8Il4EloIupJRng4zy17gAd1SnFqgBqIn4i50BVMmUZFFGHAKYQdYhKQsyStSZWEEJDQR+3MFplX0jYmpZLyPRFyC81rklee6sXMQX6yjcrSWoYhWHuZZoRlGGqAtAsunKCVqNqpLnmp6NImFGmLj6OOU2GuEnQpUPCmqC5ocya0LKcWwAxWeY0zVRfPZgDpooqtwYsE1oYg/plUFzejAW8Gi2mC1r4liRS1K9MGEiYRBaehdPtgQhKfBRLUNrCBQkijYngn676VxLC4Uwqwym56sINlLJ3i12sOT44v21lbsnll41lpQ44J2wwd4jXBpUM2lpL1QLx85gVP7f4Sa7iLl+AIY5Cg2FiAoPz1xtjNy4TyobOnRConjZQgFKTm2UuuKkaTLycvM00Cww/rfqKL7gZq0wwUTElMzMAt0hrJpLJQPdCPDW5qqGNC/jdMK1Tb+yh5JWu3nKNjJki88JMfKdCQXyXVaRC89hsfPNqV2/0TRbhk9RVIRhwlqNUwiuh5WoEIy99DUuQCStK2RD1yaiUnhGxJJpqLWwcfp1Luuulp80FjN0jQjYOxTDpzCsqfmbmmh5Lhdbi1XyuoIfpttptCTkOIlQu8aSSTO93WqLqj8WMJFvYJFP3PTtULmGrGPzh84hP+Cpx7pclfMT6gBbr0JQ1d9kWJ+KWWW5j0n+8psIsEzkrmu+rjaKHGmEQxYVDCYpIMAfHbxM+kCgQ0MhXBWdP6ptUAmRcBz0ytvNQ4N6lEgX5kREcU1Ym4pKCfUVCSkiDpuHrA7rpoQKhLsJMrEOcMNV0+Ayy5uRAfkssIo9Q4OAQDL11k/qe7Qo1Ag7WDHAIVvIW1aQy/0XrCTWQ35KekMEdM1jaV92rctqDUPnAOkbRaVZAYFrlQ+V0HdwNNTC29B0qqZMfGSl9wjNYnCtS0L5dotwvuR5HqjPOuiDfBD09jhx0eaZGBthExbQ5WelikFzNhD9NCMVLFWjgqtcq0NCVUJ3IyHuXdJTl50E8xePeKuAgzs3bx9EkUgtOUEsWCO7KCsSzVndaWa0xrDXmBN/gY2ENq1akYfZX3SFNBDrUPEULOgdEoGmpQo9buMTmzqk9MswFBVLxj1Tug4uPtQpM+H0mni1zlgfAiH/tyQBXhyhBicxJyWWijNikt5SULVl8GBYBzwFQJIR/KA6VC6WCaPB4P9USzjMHLdbSuZp4jXJoe1tDwsRQ1sXVHOQndjgDQTJqqW+x8SKPzvtaASayNgSh1duumuoqmzYvhWZc6qNMS3JRfIfpbnQ+g9hkPRN72W03w8BediPPMLDfw9ag8vSvQslRn/H1iOweXFd37IlEll6h+qUt62yJ3BVseWtaHodPjYZzoolTvakzvfNDpbXA9uHdxpeh79vZ+kiUHT+6HrwTG50RPUFrcSvPP0aRE6yfsybogIqiCX49drnJ9+hoX49Yg0k0wGdu1zfQckKinC06eXQBp7+Z6Y8O/2foj1n8MSfJzV/xIuIcKtBi81ScbI67jO1bz8FnnufUAQHcOFv70Ys/5DfPR8XnP+G3QANS6VM/uJ/DGIM4HxWfv0NvoIYTPIB0cHDUdzt4aTH81x4jF5B/9/Z4efVuNdYX5tuFPp04M305e3ulz6aXb6+uVktzbF7+CoP1vWB38mRNz0f3cfxwYhi79b3j27sj311H4S7cxkdreLF1uN26a8fYPUSOvdndO07se8bYNJfG0vBt/B5nAHKy8+CpKB1sivz74tr5iPiSoI/pB2iTuC/Hc/PNzDL11cS09OncXuiL+WSmr2bW+Go+fftutpoRuM/kcLdMw7IK5Gcnses7nhtkvMo4RF4FJsHXhkEYGScM/ELv94hSF/8HAAD//wMAUEsDBAoAAAAIAPcjWV3DJN7HIQQAAM8LAAAUAAAAeGwvc2hhcmVkU3RyaW5ncy54bWytVm1v2zYQ/j5g/+GgdYMbtJbTIHtpbXeqJSdaYtmQ5W39SEu0TUQiNZJykn7c/9qf2S/ZyXYSV6cUGFDDMqw7kne8e56H7L+/K3LYcm2EkgPntNtzgMtUZUKuB84iGb/+2QFjmcxYriQfOPfcOO+H337TN8YCzpVm4GysLd+6rkk3vGCmq0ou0bNSumAWX/XaNaXmLDMbzm2Ru296vR/dggnpQCXFXxUfqUragfPTLw6k+7+nZz1n2Ddi2LdDjunZT33XDvtubdlbk9j7PbiG4M9ZEM0DiIPZNE6ag/4IgisIIj+MLpquyJsETVvz3Q9mXpxMgogsPOd6K1LeNI8W82Q6CWJI4nBGMw5n4AfzJIy8JJxGTf9CCsszmFtmuWk6P04XMXi+HwfzOXSm0fVHCHFfIy8JIBzD6NKLLgKfpBlGowCuvXnyUKiXzSGhtFxLlsPCcJjK/L45IOYpF6WF70h1ME9i4ybVOBrRRGpTaY3Quj9pOryi7jmxCr1imoMLiUaoNN0fEFA3K2bIvOtKphuSlpCSazIUNwATjnt3YVqDTBRkQzOuwRe8oGVLRcalZTlp1aWyPCfbqayCeDeBhGD6BulG4MLuRNM2rujKE5FztubQ+bV7fu5OXkH3vOdeTUijp3ZDS5ColoQu5wTvEbegVtDi2ReIFfAaxlWeg88IghZzAswZ5ox4EzITad0FfQCZrIolLqgksNRW2JmD4xWgnECpUVs02la8hhIW7RWgNEEuUIyEhHSjlVS5WuOiOSidcd0llKiWtm3TXrZlMqXEOzmkqnmpNBZBckgPSIZ9MrW9EUbjd4Y/S3fYF/hU+JhPsGU5StsbB99STFMDtqRAUT2tLXqspN0PSdhGFaw2rlgh8vu9dTfP3a37hEsYsTytcmbVobf6Kbr42lFrwX9rSpbibFR0gyLIHTwMOkusULbr2lJtOUhVC1mCQgAoCFZIVgvCy8cEj8vujgg2ur+RriGEXhD6qrrLD7JC+izWGLbSVKM3HI8cKmdHQEZGWsFaseyVCMItz9rEEOcJ4nhq1AZXJVlKlt4Y1J8v6MlRCVvpu5MwAz+wonx3vA50XmDZiA4Ed+mGyTWpS4hcZKRYTLKMWOPKGDr2cH5dIS0zVRBCYOSq5i+TgCMRKx0C2Ae6tIFWr5cDZzw+230ayPU0duuLdFGVNViXWsMWV61xH2Oefa2YrXg/OUWp2mkWnl2Qsfs6JavZlufv4Lz3ff1aPkCG7U5GuBWoq0sOJYVXOyM/xxw8dxL/LzQRuEQxWdePCEnjaplTUb34QG5HNTgIw2tdx4L4iBvw1a2E0PLCIEODO7xkoiof3TdIkOdnP1eAI6aR1XBz5E4WENN+u9D59+9/KPEa8P8Mk+3HNeb6eEQuea5un7+xunghH/4HUEsDBAoAAAAIAAAAIQDKUKf31AMAAFYVAAAQAAAAeGwvY2FsY0NoYWluLnhtbHSYS2+bQBSF95X6Hyz2rQNOn4rTRe3MAOENZW05NInkR2RbVfvvi0oY4H7TZb4Mw5lzz71gbr793u9mv5rT+fl4WDru+ytn1hy2x4fnw+PSqcq7d5+d2fmyOTxsdsdDs3T+NGfn2+3bNzfbzW77/WnzfJi1OxzOS+fpcnn5Op+ft0/NfnN+f3xpDu1/fh5P+82l/fP0OD+/nJrNw/mpaS773dy7uvo437cbOLc329lp6SjPdWbPS8dzZrtWijN/5dl/eGp4vzIBiUEikBAkAPFBNIl7/U//B6FfuYtX3uu8A1mDrEC02zrT+vPBOKPczrGB3IGsQVYg2m3LPt35i5QswVqClQS6jc5k03TRkfYYbV6GAqeL7lLJ9Sep6qNUJcFaghUuacszUbWWYCVBb/P1yPjOsBHpjjAC3VlHoDvNAO46aQN4FT+AV/ED+C4vUdDar5j2UGKs7zOocWUHhpslQ1km/fhj0fdpv9e91xdwIH2pB9Kd3zMm3nud1jHpNIxJ11Nj0nXTmHR9MZDS6Jm6UHpSVelJVSVUlZ5UVXpSVelJVaVHVdK30utiNFLuSidLF5pdqTmA/z6IBlEgAfzxQTSIAsnhagDig2gQBRKiOgGID6JBlGUfWWUfddcgCiRANnwQDaJAYiQqAPFBNIiy7COT6SOrGkSBBEivD6JBFEiAzPsgGkSBFOiUAMQH0SDKQmTHafSgz64EyUGUK2egBvFBApDUlekNQHwQDaJACkyJHL2ToU9TzIQE+8TYJ7L0O+bhop+Z09kewpMEdSyQ4RT9G0NDgZ1j1DFGGkPcK0cnJnAgwb1CnCLHvRLcq8DOKfzP0IkZplCEPGQgucUfmeoMjkUgKU4a8qSWrpcJiXGuHCSFY6GlOvKZXmBNDMdyeoiMZSAp6hUihwmTCRJbnsXy/SGyJEF6GFlOIffJcK/Ykg05lzKkJbJMMzlvI2QjA0ktPSjfrxIkobCkRb6nRUhLZpkkMi0hPExACstzXzqWIy2RZQLLjksts1RWMEEFC9bUMv+ZFulziCQkfLKApEhCgSmRgISWaSxPmiMtEdKSgaSWtMhsxJY5L9+vIsyNDCRFEkLUPQEp+P5pno/9Ly8fRIMokMpkbPqcraCzgoYKKaoNmf70r5CuCrmtDZHXyo6rjatypaxIbaomViIDtSHTlTV6sELGakOkHtkvtUma1CMnYW3SLveUyayH72aTzy0Vuqw2RN5dzqLa9Ox0ZYb81Jx1WHMPklj2wfMdayLLVVJ5iDUprzJfNkTm8cWjWvTZMz7MzRfR278AAAD//wMAUEsDBAoAAAAIAPcjWV1DzIBygAEAABYDAAARAAAAZG9jUHJvcHMvY29yZS54bWx9ksFu2zAMhu8F9g6G7o4suw06IXGBbeipBQo0xYbdVIlN1dqSIDF18/ZlbMdJhmA3kv/PTxSlxc1n22QfEJP1bsnErGAZOO2Ndesle1rd5tcsS6icUY13sGRbSOym/nax0EFqH+Eh+gARLaSMSC5JHZbsFTFIzpN+hValGTkciS8+tgopjWselH5Xa+BlUcx5C6iMQsV3wDxMRDYijZ6QYRObHmA0hwZacJi4mAl+8CLENp1t6JUjZ2txG+CsdS9O7s9kJ2PXdbOu6q00v+B/7u8e+6vm1u12pYHVC6MlWmygXvBDSFHaPL+BxqE8JRTrCAp9HIQpoTW/w7bz0SRSTjKyGUg62oD0eEPfSYHcjUp4T6/5YsH82A6Ef2tUivBh0wA5ycZtDuOAyWgLctjZXvld/fy1umV1WYjvuSjyqliJSlZzWZR/dxOd9B+A7Xj+f4nlPC+qXIiVmMvySl5WR8Q9oB9fE3zt43i/Q9b/UYf0SR5R4Wbc4NnS8U+uvwBQSwMECgAAAAgAAAAhAEIrZXoEAgAAqAQAABAAAABkb2NQcm9wcy9hcHAueG1snFRdb9MwFH1H4j+YCGnwsCYbVYUqN9Noi/ZAoaLteETGuWmtJbZ1fVc1+/XcNGqajgKCt/vlc49PjiNvdmUhtoDBODuKrnpJJMBqlxm7HkWr5cfL95EIpGymCmdhFFUQopv05Qs5R+cByUAQDGHDKNoQ+WEcB72BUoUety13coelIk5xHbs8NxomTj+WYCm+TpJBDDsCm0F26VvAqEEcbul/QTOna37hfll5JpzKW+8LoxXxLdOZ0eiCy0lMdxoKGXebktktQD+ioSpNZNxN5UKrAsYMnOaqCCDjY0HegapFmyuDIZVbGm5Bk0MRzBPL1o/EDxWgpjOKtgqNssS06rEm2ceFD4TpN4cPYQNAQcY80BT3YXe2G5t+2t8PcPDHwQbrsyohE1+VXcO/rLg+v6Lm2NyVd5+qsDRUQPiSzxXSGVEGXVH21BpJGpbTHRsogEDwDqkrRSvKHFBMDJTizWoxef32LzMzs+Nrjx8R2eHV+enD0gkEjcbXfjmRqF19cdz9DPfi1RyNpe+3COoso87RPe3fHTgR9pmUM2XVGpAVb6OxK72yVTrl10xPonF5FQhKvsGhKT8Z+xBWfukmiuBg49OiXGwUQsbOb23eFuQdOxgLBvnAdq4/+GnepmG8qf2VHSB+bdRv8r758aRXg17yLuHn1qnJ+PiLSX8CAAD//wMAUEsDBAoAAAAAAPcjWV0AAAAAAAAAAAAAAAADAAAAeGwvUEsDBAoAAAAAAPcjWV0AAAAAAAAAAAAAAAAOAAAAeGwvd29ya3NoZWV0cy9QSwMECgAAAAAA9yNZXQAAAAAAAAAAAAAAAAkAAABkb2NQcm9wcy9QSwECFAAKAAAACAAAACEAOvDLq4sBAAAcBwAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUAAoAAAAIAAAAIQC1VTAj9AAAAEwCAAALAAAAAAAAAAAAAAAAALwBAABfcmVscy8ucmVsc1BLAQIUAAoAAAAIAPcjWV2Mu1TKZQMAADEJAAAPAAAAAAAAAAAAAAAAANkCAAB4bC93b3JrYm9vay54bWxQSwECFAAKAAAACAAAACEAbPtZTBoBAADmBAAAGgAAAAAAAAAAAAAAAABrBgAAeGwvX3JlbHMvd29ya2Jvb2sueG1sLnJlbHNQSwECFAAKAAAACAD3I1ldE9NJ+V8TAABZkAAAGAAAAAAAAAAAAAAAAAC9BwAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1sUEsBAhQACgAAAAgA9yNZXUKtykniBAAAuhEAABgAAAAAAAAAAAAAAAAAUhsAAHhsL3dvcmtzaGVldHMvc2hlZXQyLnhtbFBLAQIUAAoAAAAIAPcjWV1oKovXfgYAALwbAAAYAAAAAAAAAAAAAAAAAGogAAB4bC93b3Jrc2hlZXRzL3NoZWV0My54bWxQSwECFAAKAAAACAD3I1ldRGnkCIoDAAC/DAAAGAAAAAAAAAAAAAAAAAAeJwAAeGwvd29ya3NoZWV0cy9zaGVldDQueG1sUEsBAhQACgAAAAgAAAAhAHU+mWmTBgAAjBoAABMAAAAAAAAAAAAAAAAA3ioAAHhsL3RoZW1lL3RoZW1lMS54bWxQSwECFAAKAAAACAAAACEAJml2DhwPAABklgAADQAAAAAAAAAAAAAAAACiMQAAeGwvc3R5bGVzLnhtbFBLAQIUAAoAAAAIAPcjWV3DJN7HIQQAAM8LAAAUAAAAAAAAAAAAAAAAAOlAAAB4bC9zaGFyZWRTdHJpbmdzLnhtbFBLAQIUAAoAAAAIAAAAIQDKUKf31AMAAFYVAAAQAAAAAAAAAAAAAAAAADxFAAB4bC9jYWxjQ2hhaW4ueG1sUEsBAhQACgAAAAgA9yNZXUPMgHKAAQAAFgMAABEAAAAAAAAAAAAAAAAAPkkAAGRvY1Byb3BzL2NvcmUueG1sUEsBAhQACgAAAAgAAAAhAEIrZXoEAgAAqAQAABAAAAAAAAAAAAAAAAAA7UoAAGRvY1Byb3BzL2FwcC54bWxQSwECFAAKAAAAAAD3I1ldAAAAAAAAAAAAAAAAAwAAAAAAAAAAABAAAAAfTQAAeGwvUEsBAhQACgAAAAAA9yNZXQAAAAAAAAAAAAAAAA4AAAAAAAAAAAAQAAAAQE0AAHhsL3dvcmtzaGVldHMvUEsBAhQACgAAAAAA9yNZXQAAAAAAAAAAAAAAAAkAAAAAAAAAAAAQAAAAbE0AAGRvY1Byb3BzL1BLBQYAAAAAEQARADQEAACTTQAAAAA=' };
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
          <span>Destination <b>United States</b></span><span>Currency <b>USD</b></span><span>Full day <b>$100</b></span><span>Partial day <b>$50</b></span><span>Department <b>Service</b></span>
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
          <${Field} id="it-cust" label="Customer / trip" hint="Used in the file name"><${TextInput} id="it-cust" value=${r.customer} placeholder="e.g. WBD LA" onValue=${v => set({ customer: v })} /><//>
          <${Field} id="it-mgr" label="Manager name"><${TextInput} id="it-mgr" value=${r.manager} placeholder="Manager’s first and last name" onValue=${v => { set({ manager: v }); }} /><//>
          <${Field} id="it-loc" label="Location (optional)" hint="Printed in the Location row on days with charges"><${TextInput} id="it-loc" value=${r.location} placeholder="e.g. Burbank, CA" onValue=${v => set({ location: v })} /><//>
        </div>
        <p class="muted small">Department: <b>Service</b> · Amounts are the Canadian dollars that posted to your card.</p>
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
