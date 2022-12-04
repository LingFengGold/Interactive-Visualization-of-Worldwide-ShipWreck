/**
 * Dashboard handler
 */

 export interface MyWindow extends Window {
    expense: () => void;
    about: () => void;
    settings: () => void;
    dashboard: () => void;
    getDate: (value: Date) => string;
    getCurrencyVal: (value: number) => string;
    getNumberVal: (value: number) => string;
    expenseDS: Object;
    startDate: Date;
    country: string;
    endDate: Date;
    userName: string;
    userFirstName: string;
  }
  
  import { enableRipple } from "@syncfusion/ej2-base";
  enableRipple(true);
  
  import {
    AccumulationTheme,
    AccumulationChart,
    AccumulationLegend,
    PieSeries,
    IAccLoadedEventArgs,
    AccumulationDataLabel
  } from "@syncfusion/ej2-charts";
  AccumulationChart.Inject(AccumulationLegend, PieSeries, AccumulationDataLabel);
  
  import { DateRangePicker, RangeEventArgs } from "@syncfusion/ej2-calendars";
  import { Query, DataManager, Predicate } from "@syncfusion/ej2-data";
  import {
    Internationalization,
    isNullOrUndefined as isNOU,
    extend
  } from "@syncfusion/ej2-base";
  
  import { DashboardLayout } from "@syncfusion/ej2-layouts";
  import { DropDownList } from "@syncfusion/ej2-dropdowns";
  const axios = require("axios");
  
  import {
    AccumulationChart,
    AccumulationLegend,
    PieSeries,
    AccumulationDataLabel,
    AccumulationTooltip,
    IAccTextRenderEventArgs,
    AccumulationSelection,
    IAccAnimationCompleteEventArgs,
    Chart,
    ColumnSeries,
    Category,
    Legend,
    Tooltip,
    ChartAnnotation,
    LineSeries,
    AreaSeries,
    DateTime,
    Logarithmic,
    Crosshair
  } from "@syncfusion/ej2-charts";
  AccumulationChart.Inject(
    AccumulationLegend,
    PieSeries,
    AccumulationDataLabel,
    AccumulationTooltip,
    AccumulationSelection,
    ChartAnnotation
  );
  Chart.Inject(
    ColumnSeries,
    Category,
    Legend,
    Tooltip,
    ChartAnnotation,
    DateTime,
    Crosshair
  );
  Chart.Inject(LineSeries, AreaSeries, DateTime, Logarithmic, Legend, Tooltip);
  import { Grid, Page, Toolbar } from "@syncfusion/ej2-grids";
  
  Grid.Inject(Page, Toolbar);
  
  export interface IExpense {
    UniqueId: string;
    DateTime: Date;
    Category: string;
    PaymentMode: string;
    TransactionType: string;
    Description: string;
    Amount: number;
  }
  
  interface IExpenseData {
    x: string;
    y: number;
    text: string;
  }
  
  let predicateStart: Predicate = new Predicate(
    "DateTime",
    "greaterthanorequal",
    window.startDate
  );
  let predicateEnd: Predicate = new Predicate(
    "DateTime",
    "lessthanorequal",
    window.endDate
  );
  let predicate: Predicate = predicateStart.and(predicateEnd);
  
  declare let window: MyWindow;
  
  let chartDS: { [key: string]: Object[] };
  let pieChartDS: { [key: string]: Object[] };
  let gridDS: { [key: string]: Object[] };
  let linechartObj: Chart;
  let linechart: Chart;
  let columnChartObj: Chart;
  let gridObj: Grid;
  let pie: AccumulationChart;
  let grid: Grid;
  let pieLegendData: Object[] = [];
  let pieRenderData: IExpenseData[] = [];
  
  let legendData: IExpense[] = [];
  let pieRenderingData: Object[] = [];
  export let category: string[] = [];
  let expTotal: number = 0;
  let dateRangePickerObject: DateRangePicker;
  let groupValue: number = 0;
  let renderData: Object[];
  let hiGridData: Object[];
  
  export function cardUpdate(toUpdate?: boolean): void {
    if (toUpdate) {
      updatePredicate();
    }
    let intl: Internationalization = new Internationalization();
    let nFormatter: Function = intl.getNumberFormat({
      skeleton: "C0",
      currency: "USD"
    });
    let incomeRS: number = 0;
    let expenseRS: number = 0;
    /* tslint:disable-next-line */
    let incomeD: any[];
    /* tslint:disable-next-line */
    let expenseD: any[];
    new DataManager(window.expenseDS)
      .executeQuery(
        new Query().where(
          predicateStart
            .and(predicateEnd)
            .and("TransactionType", "equal", "Income")
        )
      )
      /* tslint:disable-next-line */
      .then(function(e: any) {
        incomeD = objectAssign(e);
        for (let i: number = 0; i < incomeD.length - 1; i++) {
          incomeRS += parseInt(incomeD[i].Amount, 0);
        }
        if (document.getElementById("tolincome")) {
          document.getElementById(
            "tolincome"
          ).textContent = window.getCurrencyVal(incomeRS ? incomeRS : 0);
        }
      });
  
    new DataManager(window.expenseDS)
      .executeQuery(
        new Query().where(
          predicateStart
            .and(predicateEnd)
            .and("TransactionType", "equal", "Expense")
        )
      )
      /* tslint:disable-next-line */
      .then(function(e: any) {
        expenseD = objectAssign(e);
        for (let i: number = 0; i < expenseD.length - 1; i++) {
          expenseRS += parseInt(expenseD[i].Amount, 0);
        }
        if (document.getElementById("tolexpense")) {
          document.getElementById(
            "tolexpense"
          ).textContent = window.getCurrencyVal(expenseRS ? expenseRS : 0);
        }
        if (document.getElementById("current-balance")) {
          document.getElementById(
            "current-balance"
          ).textContent = window.getCurrencyVal(incomeRS - expenseRS);
        }
        if (document.getElementById("tolbalance")) {
          document.getElementById(
            "tolbalance"
          ).textContent = window.getCurrencyVal(incomeRS - expenseRS);
        }
      });
  }
  
  if (isNOU(window.startDate)) {
    window.startDate = new Date("2020-9-15");
    window.endDate = new Date("2020-9-25");
    window.country = "india";
  }
  
  // tslint:disable-next-line:max-func-body-length
  function onDateRangeChange(args: any): void {
    if (args.itemData && args.itemData.value) {
      window.country = args.itemData.value;
    }
  
    if (args.startDate || args.endDate) {
      window.startDate = args.startDate;
      window.endDate = args.endDate;
    }
  
    axios
      .get(
        "https://api.covid19api.com/total/country/" +
          window.country +
          "" +
          "?from=" +
          window.startDate.toISOString() +
          "&to=" +
          window.endDate.toISOString()
      )
      .then(function(response: any) {
        var res = response["data"];
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].Date = new Date(response.data[i].Date);
          var Active = +response.data[i].Active;
          var Deaths = +response.data[i].Deaths;
          var Confirmed = +response.data[i].Confirmed;
          var Recovered = +response.data[i].Recovered;
        }
        if (document.getElementById("Active")) {
          document.getElementById("Active").textContent = Active.toString();
        }
        if (document.getElementById("Confirmed")) {
          document.getElementById("Confirmed").textContent = Confirmed.toString();
        }
  
        if (document.getElementById("Recovered")) {
          document.getElementById("Recovered").textContent = Recovered.toString();
        }
  
        if (document.getElementById("Deaths")) {
          document.getElementById("Deaths").textContent = Deaths.toString();
        }
      });
  
    lineDS = [];
    lineD = [];
    columnIncomeDS = [];
    columnExpenseDS = [];
    tempChartExpenseDS = [];
    tempChartIncomeDS = [];
    lineD = [];
    var piedata: any = [];
    axios
      .get(
        "https://api.covid19api.com/total/country/" +
          window.country +
          "/status/confirmed" +
          "?from=" +
          window.startDate.toISOString() +
          "&to=" +
          window.endDate.toISOString()
      )
      .then(function(response: any) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].Date = new Date(response.data[i].Date);
          var Status = +response.data[i].Cases;
        }
        response.data[0].Cases = Status;
        piedata = piedata.concat(response.data[0]);
  
        axios
          .get(
            "https://api.covid19api.com/total/country/" +
              window.country +
              "/status/recovered" +
              "?from=" +
              window.startDate.toISOString() +
              "&to=" +
              window.endDate.toISOString()
          )
          .then(function(response: any) {
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].Date = new Date(response.data[i].Date);
              var Status = +response.data[i].Cases;
            }
            response.data[0].Cases = Status;
            piedata = piedata.concat(response.data[0]);
          });
        axios
          .get(
            "https://api.covid19api.com/total/country/" +
              window.country +
              "/status/deaths" +
              "?from=" +
              window.startDate.toISOString() +
              "&to=" +
              window.endDate.toISOString()
          )
          .then(function(response: any) {
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].Date = new Date(response.data[i].Date);
              var Status = +response.data[i].Cases;
            }
            response.data[0].Cases = Status;
            piedata = piedata.concat(response.data[0]);
            axios
              .get(
                "https://api.covid19api.com/total/country/" +
                  window.country +
                  "/status/active" +
                  "?from=" +
                  window.startDate.toISOString() +
                  "&to=" +
                  window.endDate.toISOString()
              )
              .then(function(response: any) {
                for (var i = 0; i < response.data.length; i++) {
                  response.data[i].Date = new Date(response.data[i].Date);
                  var Status = +response.data[i].Cases;
                }
                response.data[0].Cases = Status;
                piedata = piedata.concat(response.data[0]);
                piedata = [piedata[0], piedata[1], piedata[2], piedata[3]];
  
                pie.series = [
                  {
                    dataSource: piedata,
                    xName: "Status",
                    yName: "Cases",
                    radius: "83%",
                    startAngle: 0,
                    endAngle: 360,
                    innerRadius: "50%",
                    dataLabel: {
                      name: "Cases",
                      visible: true,
                      position: "Outside",
                      connectorStyle: { length: "10%" },
                      font: {
                        color: "Black",
                        size: "14px",
                        fontFamily: "Roboto"
                      }
                    },
                    palettes: [
                      "#61EFCD",
                      "#CDDE1F",
                      "#FEC200",
                      "#CA765A",
                      "#2485FA",
                      "#F57D7D",
                      "#C152D2",
                      "#8854D9",
                      "#3D4EB8",
                      "#00BCD7"
                    ]
                  }
                ];
                pie.dataBind();
                pie.refresh();
                // createLegendData('pieUpdate');
              });
          });
      });
  
    axios
      .get(
        "https://api.covid19api.com/total/country/" +
          window.country +
          "" +
          "?from=" +
          window.startDate.toISOString() +
          "&to=" +
          window.endDate.toISOString()
      )
      .then(function(response: any) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].Date = new Date(response.data[i].Date);
        }
        debugger;
        // getCoulmnChartIncomeDS(e);
        columnChartObj.setProperties({
          //Initializing Chart Series
          primaryXAxis: {
            labelFormat: "MMM",
            valueType: "DateTime",
            edgeLabelPlacement: "Shift"
          },
          //Initializing Primary Y Axis
          primaryYAxis: {
            // title: 'Amount',
            // labelFormat: 'c0'
          },
          useGroupingSeparator: true,
          series: [
            {
              type: "Column",
              dataSource: response.data,
              // legendShape: 'Circle',
              xName: "Date",
              width: 2,
              yName: "Recovered",
              name: "Recovered",
              marker: {
                visible: true,
                height: 10,
                width: 10
              },
              fill: "#A16EE5",
              border: { width: 0.5, color: "#A16EE5" },
              animation: { enable: false }
            },
            {
              type: "Column",
              dataSource: response.data,
              // legendShape: 'Circle',
              xName: "Date",
              width: 2,
              yName: "Confirmed",
              name: "Confirmed",
              marker: {
                visible: true,
                height: 10,
                width: 10
              },
              fill: "#4472C4",
              animation: { enable: false }
            }
          ]
        });
        columnChartObj.refresh();
        lineD = [];
  
        linechartObj.setProperties({
          //Initializing Chart Series
          series: [
            {
              type: "Area",
              dataSource: response.data,
              xName: "Date",
              width: 2,
              marker: {
                visible: true,
                width: 10,
                height: 10,
                fill: "white",
                border: { width: 2, color: "#0470D8" }
              },
              yName: "Confirmed",
              name: "Confirmed",
              fill: "rgba(4, 112, 216, 0.3)",
              border: { width: 0.5, color: "#0470D8" }
            }
          ]
        });
        linechartObj.refresh();
  
        /* tslint:enable */
        gridObj.setProperties({
          dataSource: response.data
          //Initializing Chart Series
          // query: new Query().where(predicate).sortByDesc('Date').take(5)
        });
        gridObj.refresh();
  
        grid.dataSource = response.data;
        grid.dataBind();
        grid.refresh();
        formatRangeDate();
      });
  }
  function InitializeComponet() {
    // initialize DropDownList component
    let dropDownListObj: DropDownList = new DropDownList({
      // bind the DataManager instance to dataSource property
  
      // bind the Query instance to query property
      // map the appropriate columns to fields property
  
      // set the placeholder to DropDownList input element
      placeholder: "Select a country",
      // sort the resulted items
      sortOrder: "Ascending",
      // set the height of the popup element
      popupHeight: "200px",
      change: onDateRangeChange
    });
    dropDownListObj.appendTo("#country");
  
    if (document.getElementById("user-name")) {
      document.getElementById("user-name").textContent = window.userName;
    }
    cardUpdate();
    new DataManager(window.expenseDS)
      .executeQuery(
        new Query().where(predicate.and("TransactionType", "equal", "Expense"))
      )
      .then(function(e) {
        getCoulmnChartExpenseDS(e);
      });
    var piedata: any = [];
    axios
      .get(
        "https://api.covid19api.com/total/country/" +
          window.country +
          "/status/confirmed" +
          "?from=" +
          window.startDate.toISOString() +
          "&to=" +
          window.endDate.toISOString()
      )
      .then(function(response: any) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].Date = new Date(response.data[i].Date);
          var Status = +response.data[i].Cases;
        }
        response.data[0].Cases = Status;
        piedata = piedata.concat(response.data[0]);
  
        axios
          .get(
            "https://api.covid19api.com/total/country/" +
              window.country +
              "/status/recovered" +
              "?from=" +
              window.startDate.toISOString() +
              "&to=" +
              window.endDate.toISOString()
          )
          .then(function(response: any) {
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].Date = new Date(response.data[i].Date);
              var Status = +response.data[i].Cases;
            }
            response.data[0].Cases = Status;
            piedata = piedata.concat(response.data[0]);
          });
        axios
          .get(
            "https://api.covid19api.com/total/country/" +
              window.country +
              "/status/deaths" +
              "?from=" +
              window.startDate.toISOString() +
              "&to=" +
              window.endDate.toISOString()
          )
          .then(function(response: any) {
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].Date = new Date(response.data[i].Date);
              var Status = +response.data[i].Cases;
            }
            response.data[0].Cases = Status;
            piedata = piedata.concat(response.data[0]);
            axios
              .get(
                "https://api.covid19api.com/total/country/" +
                  window.country +
                  "/status/active" +
                  "?from=" +
                  window.startDate.toISOString() +
                  "&to=" +
                  window.endDate.toISOString()
              )
              .then(function(response: any) {
                for (var i = 0; i < response.data.length; i++) {
                  response.data[i].Date = new Date(response.data[i].Date);
                  var Status = +response.data[i].Cases;
                }
                response.data[0].Cases = Status;
                piedata = piedata.concat(response.data[0]);
                piedata = [piedata[0], piedata[1], piedata[2], piedata[3]];
  
                pie = new AccumulationChart({
                  enableSmartLabels: true,
                  width: "100%",
                  height: "350px",
                  center: { x: "50%", y: "50%" },
  
                  legendSettings: { visible: true, position: "Bottom" },
                  series: [
                    {
                      dataSource: piedata,
                      xName: "Status",
                      yName: "Cases",
                      radius: "83%",
                      startAngle: 0,
                      endAngle: 360,
                      innerRadius: "50%",
                      dataLabel: {
                        name: "Cases",
                        visible: true,
                        position: "Inside",
                        font: {
                          color: "Black",
                          size: "14px",
                          fontFamily: "Roboto"
                        }
                      },
                      palettes: [
                        "#61EFCD",
                        "#CDDE1F",
                        "#FEC200",
                        "#CA765A",
                        "#2485FA",
                        "#F57D7D",
                        "#C152D2",
                        "#8854D9",
                        "#3D4EB8",
                        "#00BCD7"
                      ]
                    }
                  ]
                });
  
                pie.appendTo("#total-expense");
              });
          });
      });
  
    axios
      .get(
        "https://api.covid19api.com/total/country/" +
          window.country +
          "" +
          "?from=" +
          window.startDate.toISOString() +
          "&to=" +
          window.endDate.toISOString()
      )
      .then(function(response: any) {
        var res = response["data"];
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].Date = new Date(response.data[i].Date);
          var Active = +response.data[i].Active;
          var Deaths = +response.data[i].Deaths;
          var Confirmed = +response.data[i].Confirmed;
          var Recovered = +response.data[i].Recovered;
        }
        if (document.getElementById("Active")) {
          document.getElementById("Active").textContent = Active.toString();
        }
        if (document.getElementById("Confirmed")) {
          document.getElementById("Confirmed").textContent = Confirmed.toString();
        }
        if (document.getElementById("Recovered")) {
          document.getElementById("Recovered").textContent = Recovered.toString();
        }
        if (document.getElementById("Deaths")) {
          document.getElementById("Deaths").textContent = Deaths.toString();
        }
        columnChartObj = new Chart({
          primaryXAxis: {
            labelFormat: "MMM",
            valueType: "DateTime",
            intervalType: "Months"
          },
          primaryYAxis: {},
          useGroupingSeparator: true,
          series: [
            {
              type: "Column",
              dataSource: response.data,
              xName: "Date",
              width: 2,
              yName: "Confirmed",
              name: "Confirmed",
              fill: "#00bdae",
              animation: { enable: false },
              marker: {
                visible: true,
                height: 10,
                width: 10
              }
            },
            {
              type: "Column",
              dataSource: response.data,
              xName: "Date",
              width: 2,
              yName: "Recovered",
              name: "Recovered",
              fill: "#357cd2",
              animation: { enable: false },
              marker: {
                visible: true,
                height: 10,
                width: 10
              }
            }
          ],
          annotations: [
            {
              content:
                '<p style="font-family:Roboto;font-size: 16px;font-weight: 400;font-weight: 400;letter-spacing: 0.02em;line-height: 16px;color: #797979 !important;">Confirmed - Recovered</p>',
              x: "200px",
              y: "9%",
              coordinateUnits: "Pixel",
              region: "Chart"
            }
          ],
          margin: { top: 90 },
          legendSettings: { visible: true },
          titleStyle: {
            textAlignment: "Near",
            fontWeight: "500",
            size: "16",
            color: "#000"
          },
          tooltip: {
            fill: "#707070",
            enable: true,
            shared: true,
            format: "${series.name} : ${point.y}",
            header: "Month - ${point.x} "
          }
        });
        columnChartObj.appendTo("#account-balance");
  
        var content =
          '<p style="font-family:Roboto;font-size: 16px;font-weight: 400;font-weight: 400;letter-spacing: 0.02em;line-height: 16px;color: #797979 !important;">Active - Recovered</p>';
        linechartObj = new Chart({
          primaryXAxis: {
            valueType: "DateTime",
            labelFormat: "MMM",
            majorGridLines: { width: 0 },
            intervalType: "Months"
          },
          primaryYAxis: {},
          useGroupingSeparator: true,
          chartArea: {
            border: {
              width: 0
            }
          },
          annotations: [
            {
              content: content,
              x: "75px",
              y: "9%",
              coordinateUnits: "Pixel",
              region: "Chart"
            }
          ],
          series: [
            {
              type: "Area",
              dataSource: response.data,
              xName: "Date",
              width: 2,
              yName: "Active",
              name: "Active",
              fill: "#b3d4f3",
              border: { width: 0.5, color: "#0470D8" },
              marker: {
                visible: true,
                width: 10,
                height: 10,
                fill: "white",
                border: { width: 2, color: "#0470D8" }
              }
            },
            {
              type: "Area",
              dataSource: response.data,
              xName: "Date",
              width: 2,
              yName: "Recovered",
              name: "Recovered",
              fill: "#4273f942",
              border: { width: 0.5, color: "#0470D8" },
              marker: {
                visible: true,
                width: 10,
                height: 10,
                fill: "white",
                border: { width: 2, color: "#0470D8" }
              }
            }
          ],
          margin: { top: 90 },
          tooltip: {
            fill: "#707070",
            enable: true,
            shared: true,
            format: "${series.name} : ${point.y}",
            header: "Month - ${point.x} "
          }
        });
        linechartObj.appendTo("#balance");
        var contentline =
          '<p style="font-family:Roboto;font-size: 16px;font-weight: 400;font-weight: 400;letter-spacing: 0.02em;line-height: 16px;color: #797979 !important;">Confirmed</p>';
        linechart = new Chart({
          primaryXAxis: {
            valueType: "DateTime",
            labelFormat: "MMM",
            majorGridLines: { width: 0 },
            intervalType: "Months"
          },
          primaryYAxis: {},
          useGroupingSeparator: true,
          chartArea: {
            border: {
              width: 0
            }
          },
          annotations: [
            {
              content: contentline,
              x: "75px",
              y: "9%",
              coordinateUnits: "Pixel",
              region: "Chart"
            }
          ],
          series: [
            {
              type: "Line",
              dataSource: response.data,
              xName: "Date",
              width: 2,
              yName: "Confirmed",
              name: "Confirmed",
              fill: "#b3d4f3"
              // border: { width: 0.5, color: '#0470D8' },
              // marker: {
              //     visible: true,
              //     width: 10,
              //     height: 10,
              //     fill: 'white',
              //     // border: { width: 2, color: '#0470D8' },
              // },
            }
          ],
          margin: { top: 90 },
          tooltip: {
            fill: "#707070",
            enable: true,
            shared: true,
            format: "${series.name} : ${point.y}",
            header: "Month - ${point.x} "
          }
        });
        linechart.appendTo("#Confirmed-line");
  
        gridObj = new Grid({
          dataSource: response.data,
          allowSorting: true,
          enableHover: false,
          allowKeyboard: true,
          allowPaging: true,
          width: "100%",
          height: 250,
          // toolbar: [{ text: 'Recent Transactions' }],
          pageSettings: {
            pageCount: 4,
            pageSize: 14
          },
          columns: [
            {
              field: "Date",
              headerText: "Date",
              width: 245,
              format: "yMd",
              hideAtMedia: "(min-width: 600px)"
            },
            {
              field: "Active",
              headerText: "Active",
              width: 245
            },
            {
              field: "Recovered",
              headerText: "Recovered",
              width: 245,
              hideAtMedia: "(min-width: 600px)"
            },
            {
              field: "Deaths",
              headerText: "Deaths",
              width: 245,
              hideAtMedia: "(min-width: 1050px)"
            },
            {
              field: "Confirmed",
              headerText: "Confirmed",
              width: 245,
              textAlign: "Right"
            }
          ]
        });
        gridObj.appendTo("#recentexpense-grid");
      });
  }
  
  /* tslint:disable-next-line */
  let columnIncomeDS: any = [];
  /* tslint:disable-next-line */
  let columnExpenseDS: any = [];
  /* tslint:disable-next-line */
  let lineDS: any = [];
  /* tslint:disable-next-line */
  let tempChartIncomeDS: any = {};
  /* tslint:disable-next-line */
  let tempChartExpenseDS: any = {};
  /* tslint:disable-next-line */
  let tempChartLineDS: any = {};
  /* tslint:disable-next-line */
  let curDateTime: any;
  /* tslint:disable-next-line */
  let lineD: any = [];
  
  function updatePredicate(): void {
    predicateStart = new Predicate(
      "DateTime",
      "greaterthanorequal",
      window.startDate
    );
    predicateEnd = new Predicate("DateTime", "lessthanorequal", window.endDate);
    predicate = predicateStart.and(predicateEnd);
  }
  
  /* tslint:disable-next-line */
  function objectAssign(e: any): Object[] {
    let result: Object[] = [];
    /* tslint:disable-next-line */
    let obj: any;
    obj = extend(obj, e.result, {}, true);
    for (let data: number = 0; data <= Object.keys(e.result).length; data++) {
      result.push(obj[data]);
    }
    return result;
  }
  /* tslint:disable-next-line */
  function getCoulmnChartExpenseDS(e: any): void {
    columnExpenseDS = [];
    tempChartExpenseDS = [];
    let result: Object[] = objectAssign(e);
    for (let i: number = 0; i < result.length - 1; i++) {
      /* tslint:disable-next-line */
      let cur: any = result[i];
      if (cur.DateTime.getMonth() in tempChartExpenseDS) {
        curDateTime = tempChartExpenseDS[cur.DateTime.getMonth()];
        tempChartExpenseDS[cur.DateTime.getMonth()].Amount =
          parseInt(curDateTime.Amount, 0) + parseInt(cur.Amount, 0);
      } else {
        tempChartExpenseDS[cur.DateTime.getMonth()] = cur;
        /* tslint:disable-next-line */
        tempChartExpenseDS[cur.DateTime.getMonth()].DateTime = new Date(
          new Date(
            tempChartExpenseDS[cur.DateTime.getMonth()].DateTime.setHours(
              0,
              0,
              0,
              0
            )
          ).setDate(1)
        );
      }
    }
    /* tslint:disable-next-line */
    for (let data in tempChartExpenseDS) {
      columnExpenseDS.push(tempChartExpenseDS[data]);
    }
  }
  /* tslint:disable-next-line */
  function getCoulmnChartIncomeDS(e: any): void {
    columnIncomeDS = [];
    tempChartIncomeDS = [];
    let result: Object[] = objectAssign(e);
    for (let i: number = 0; i < result.length - 1; i++) {
      /* tslint:disable-next-line */
      let cur: any = result[i];
      if (cur.DateTime.getMonth() in tempChartIncomeDS) {
        curDateTime = tempChartIncomeDS[cur.DateTime.getMonth()];
        tempChartIncomeDS[cur.DateTime.getMonth()].Amount =
          parseInt(curDateTime.Amount, 0) + parseInt(cur.Amount, 0);
      } else {
        tempChartIncomeDS[cur.DateTime.getMonth()] = cur;
        /* tslint:disable-next-line */
        tempChartIncomeDS[cur.DateTime.getMonth()].DateTime = new Date(
          new Date(
            tempChartIncomeDS[cur.DateTime.getMonth()].DateTime.setHours(
              0,
              0,
              0,
              0
            )
          ).setDate(1)
        );
      }
    }
    /* tslint:disable-next-line */
    for (let data in tempChartIncomeDS) {
      columnIncomeDS.push(tempChartIncomeDS[data]);
    }
  }
  
  function DateRange(): void {
    dateRangePickerObject = new DateRangePicker({
      format: "MM/dd/yyyy",
      change: onDateRangeChange,
      startDate: window.startDate,
      endDate: window.endDate,
      showClearButton: false,
      allowEdit: false,
      presets: [
        {
          label: "Last Month",
          start: new Date("10/1/2017"),
          end: new Date("10/31/2017")
        },
        {
          label: "Last 3 Months",
          start: new Date("9/1/2017"),
          end: new Date("11/30/2017")
        },
        {
          label: "All Time",
          start: new Date("6/1/2017"),
          end: new Date("11/30/2017")
        }
      ]
    });
    dateRangePickerObject.appendTo("#daterange");
    window.startDate = dateRangePickerObject.startDate;
    window.endDate = dateRangePickerObject.endDate;
  }
  let centerTitle: HTMLDivElement = document.createElement(
    "div"
  ) as HTMLDivElement;
  centerTitle.innerHTML = "Expenses <br> Year    2013";
  centerTitle.style.position = "absolute";
  centerTitle.style.visibility = "hidden";
  
  function getFontSize(width: number): string {
    if (width > 300) {
      return "13px";
    } else if (width > 250) {
      return "8px";
    } else {
      return "6px";
    }
  }
  
  window.dashboard = (): void => {
    let dashboard: DashboardLayout = new DashboardLayout({
      cellSpacing: [10, 10],
      allowResizing: false,
      columns: 4,
      cellAspectRatio: 2
    });
    dashboard.appendTo("#defaultLayout");
  
    predicateStart = new Predicate(
      "DateTime",
      "greaterthanorequal",
      window.startDate
    );
    predicateEnd = new Predicate("DateTime", "lessthanorequal", window.endDate);
    predicate = predicateStart.and(predicateEnd);
  
    InitializeComponet();
    // DateRangePicker Initialization.
    DateRange();
    formatRangeDate();
    // updateChart();
    window.addEventListener("resize", () => {
      setTimeout(() => {
        updateChart();
      }, 1000);
    });
  };
  function updateChart(): void {
    // let pieContainerObj: HTMLElement = document.getElementById('totalExpense');
    // if (!isNOU(pieContainerObj) && pieContainerObj.offsetWidth < 480) {
    //     disableChartLabel();
    // } else {
    //     enableChartLabel();
    // }
  }
  function disableChartLabel(): void {
    pie.series[0].dataLabel.visible = false;
    pie.dataBind();
    pie.refresh();
  }
  function enableChartLabel(): void {
    pie.series[0].dataLabel.visible = true;
    pie.dataBind();
    pie.refresh();
  }
  function formatRangeDate(): void {
    let intl: Internationalization = new Internationalization();
    let dateStart: string = intl.formatDate(dateRangePickerObject.startDate, {
      skeleton: "MMMd"
    });
    let dateEnd: string = intl.formatDate(dateRangePickerObject.endDate, {
      skeleton: "MMMd"
    });
    document.getElementById("rangeDate").textContent =
      dateStart + " - " + dateEnd;
  }
  
  window.dashboard();
  