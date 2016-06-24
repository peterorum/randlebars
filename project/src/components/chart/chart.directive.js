(function() {
  angular
    .module( "mochular.main" )
    .directive( "maChart", [ chartFactory ] );

  function chartFactory() {
    let directive = {
      templateUrl: "components/chart/chart.template.html",
      restrict: "E",
      transclude: false,
      scope: {
        categories: '=', // x
        data: '=', // y
        title: '='
      },
      replace: true,
      link: link,
      controllerAs: 'vm',
      bindToController: true,
      controller: [ '$scope', '$timeout', controller ]
    };

    function link(scope, element) {

      // set theme

      let mainColour = '#f84610';

      let theme = {
        colors: [ '#ebebeb', '#50B432', '#ED561B', '#DDDF00', '#24CBE5',
          '#64E572', '#FF9655', '#FFF263', '#6AF9C4' ],
        chart: {
          backgroundColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 1,
              y2: 1
            },
            stops: [
              [ 0, 'rgb(255, 255, 255)' ],
              [ 1, 'rgb(240, 240, 255)' ]
            ]
          },
          borderWidth: 2,
          plotBackgroundColor: 'rgba(255, 255, 255, 1.0)',
          plotShadow: true,
          plotBorderWidth: 0
        },
        title: {
          style: {
            color: '#000',
            font: 'bold 20px "Trebuchet MS", Verdana, sans-serif'
          }
        },
        subtitle: {
          style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
          }
        },
        xAxis: {
          gridLineWidth: 2,
          gridLineColor: '#fff',
          // gridZIndex: 4,
          lineColor: '#000',
          tickColor: '#000',
          lineWidth: 0,
          tickWidth: 0,
          labels: {
            style: {
              color: '#000',
              font: '11px Trebuchet MS, Verdana, sans-serif'
            }
          },
          title: {
            style: {
              color: '#333',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: 'Trebuchet MS, Verdana, sans-serif'

            }
          }
        },
        yAxis: {
          gridLineWidth: 0,
          minorTickInterval: '0',
          lineColor: '#000',
          lineWidth: 0,
          tickWidth: 0,
          tickColor: '#f00',
          labels: {
            style: {
              color: '#000',
              font: '11px Trebuchet MS, Verdana, sans-serif'
            }
          },
          title: {
            style: {
              color: '#333',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            }
          }
        },
        legend: {
          itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'

          },
          itemHoverStyle: {
            color: '#039'
          },
          itemHiddenStyle: {
            color: 'gray'
          }
        },
        labels: {
          style: {
            color: '#99b'
          }
        },

        navigation: {
          buttonOptions: {
            theme: {
              stroke: '#CCCCCC'
            }
          }
        },
        tooltip: {
          backgroundColor: mainColour,
          borderColor: 'black',
          borderRadius: 10,
          borderWidth: 0,
          style: {
            color: "#fff"
          }
        },
        plotOptions: {
          series: {
            animation: {
              duration: 2000,
              easing: 'easeOut'
            }
          }
        }
      };

      // apply theme

      // Highcharts.setOptions( theme );

      // set chart options

      let options = {
        chart: {
          type: 'area'
        },
        title: {
          text: scope.vm.title
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: scope.vm.categories,
          tickmarkPlacement: 'off',
          title: {
            enabled: true
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          labels: {
            formatter: function() {
              return ''; // this.value / 1000;
            }
          }
        },
        tooltip: {
          shared: true,
          valueSuffix: '',
          formatter: () => 'Custom tooltip'
        },
        plotOptions: {
          area: {
            stacking: 'normal',
            lineColor: mainColour,
            lineWidth: 4,
            marker: {
              lineWidth: 2,
              lineColor: mainColour
            },
            dataLabels: {
              enabled: true,
              backgroundColor: mainColour,
              borderRadius: 10,
              borderWidth: 0,
              style: {
                color: "#fff",
                textShadow: false
              },

              formatter: function() {
                console.log( this );

                let result;

                if (this.x === this.series.data[0].category) {
                  result = 'First point';
                } else if (this.x === this.series.data[this.series.data.length - 1].category) {
                  result = 'Last point';
                }

                return result;
              },

              align: 'right'
            }
          }
        },
        series: [ {
          name: 'Test',
          showInLegend: false,
          data: scope.vm.data
        } ]
      };

      let chart = _.merge( options, theme );

      // apply chart

      element.highcharts( chart );

      // store chart object

      scope.vm.chart = element.highcharts();
    }

    function controller( /*$scope, $timeout*/ ) {

      // let vm = this;
    }

    return directive;
  }

})();


