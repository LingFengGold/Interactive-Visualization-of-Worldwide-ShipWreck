# Interactive Visualization of Worldwide ShipWreck

## 项目框架参考
Beer Drinking Data Vizualization using dc.js, Crossfilter, and Leaflet <a href="https://github.com/austinlyons/dcjs-leaflet-untappd">link</a>

[![Demo
screenshot](demo.png)](https://austinlyons.github.io/dcjs-leaflet-untappd)

**研究的问题不同：** 

原框架是一个教学向的可视化框架，其目的在于让更多的人能够利用他们的框架做出个性的可视化。原框架研究的问题是饮酒的相关问题。我们的项目研究的是美国沉船事故发生的因素，因为原框架非常适合研究该类问题，所以我们选用了该框架。

**数据不同：**

原框架研究的是饮酒相关问题，其数据也是饮酒相关数据，数据来源不详。我们研究的是美国的沉船问题，因此我们在[美国商务部](https://www.commerce.gov/)[国家海洋和大气管理局](https://www.noaa.gov/)海岸调查办公室的网站找到了我们所需要的关于美国沉船的相关数据。另外，我们还对得到的数据进行了数据预处理，在后面我们进行了更加详细的描述。

**设计不同：**

我们在原框架的基础上进行了排版调整，删除了部分不适用于我们研究问题的图表。我们的项目最终保留了两幅扇形图和两幅条形图，对于原扇形图无法处理离散数据的问题，我们对其逻辑结构进行了调整，使其能将离散数据映射到范围中，转化为类别数据。与此同时我们根据我们研究问题的属性特点进行了色调的转变，例如深度，我们认为蓝色的深浅能够直观的表达深度信息。另外，为了讲清楚为什么我们要画这几张图以及我们画的这几张图能够反映出什么问题，我们在每一张图旁边添加了About the Graph模块，方便浏览者能够理解图表的用意，从而更好的使用我们设计的图表。



## 项目背景

 &emsp;&emsp;2022年7月2日，广东阳江海域发生了一起沉船事故。海上风电场项目施工浮吊船“福景001”轮在广东阳江附近海域防台锚地避3号台风“暹芭”时发生意外，锚链断裂、走锚遇险，20多条鲜活的生命就这样离我们而去。无独有偶，近几十年来，随着海洋工业的发展，世界上的沉船事故屡有发生。不同与人类的主场陆地，沉船事件发生时，深邃的海洋使人们的自救和政府的搜救变得十分困难，因此总会造成十分严重的灾难。

  &emsp;&emsp;世事无常，人生在世，我们永远无法预料意外和明天究竟哪一个会先到，很多意外的发生往往令人猝不及防，可能前一刻还在一起说笑的两个人，瞬间就会阴阳两隔。为尽可能避免此类事件的发生，我们小组了解了近年来的沉船事件后，寻找到了美国历年沉船信息数据集并将其整合归纳，制作出当前Dashboard，其有较为详细的数据展示和较为明晰的可视化显示。希望我们的项目能够在一定程度上帮助相关行业进行数据分析，以对航海事业起到积极的作用。

## 功能特色

- 提供可缩放、可移动的地图模块
- 提供多种可交互可视化
- 提供类别选择、清空功能
- 提供可视化文字说明
- 提供详细数据表格

## 可视化模块

- Sunk Year：根据沉船发生的时间具体与否进行划分
- Depth：将沉船深度统一单位后，规定范围进行划分
- GP-Quality Type：根据定位精度进行划分
- Feature Type：根据是否危害航道进行划分

## 数据预处理

&emsp;&emsp;考虑到我们需要在地图上进行映射，所以数据点需要有经纬度信息；同时沉船是影响航行安全的重要因素，所以数据点需要有沉船深度信息。因此我们对数据进行预处理，筛选掉深度不详和经纬度不详的数据点。原始数据集包含6222个数据点，筛选后剩余1733个数据点。

&emsp;&emsp;对于本数据中的深度信息，有多种不同的单位，如米、英尺等。为方便分析，我们将其统一单位至米（m）。

## 项目意义

&emsp;&emsp;在本项目中，我们可以通过选取不同的区间，观察地图上对应数据点的分布，来观察沉船深度、对航道的危害、沉船时间、定位精度和地理位置之间的对应关系。同时放大地图可以看到部分河流、航道、港口等信息，可帮助我们进一步分析沉船与人类活动之间的关系。

&emsp;&emsp;使用沉船数据可以帮助我们了解沉船事件的发生情况，比如事件发生的频率、影响因素等。这有助于我们分析事故原因，并采取相应措施来预防类似事件的发生。沉船数据的分析也有助于我们了解沉船事件对海洋生态、海事交通以及经济等方面的影响，为相关部门制定政策和决策提供依据。

## 部署情况

 &emsp;&emsp;当前项目已部署至<a href="https://lingfenggold.github.io">https://lingfenggold.github.io</a>

## 数据来源与参考

- Wrecks and Obstructions Database <a href="https://nauticalcharts.noaa.gov/data/wrecks-and-obstructions.html">link</a> 

- Beer Drinking Data Vizualization using dc.js, Crossfilter, and Leaflet <a href="https://github.com/austinlyons/dcjs-leaflet-untappd">link</a>
- Interactive Visualization of Worldwide Shark Attacks <a href="https://sarigai-geoair.github.io/MyWebApp/index.html">link</a>
