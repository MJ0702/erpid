;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-yinlianqia1" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M843.905692 132.444096 180.090628 132.444096C123.346075 132.444096 77.188291 178.601879 77.188291 235.345216l0 555.355403c0 56.743337 46.157783 102.882875 102.902336 102.882875l663.815064 0c56.748202 0 102.905985-46.139538 102.905985-102.882875l0-555.355403C946.812893 178.601879 900.65511 132.444096 843.905692 132.444096L843.905692 132.444096zM180.090628 183.13507l663.815064 0c28.787647 0 52.216228 23.422499 52.216228 52.210146l0 86.895685L127.884131 322.240901l0-86.895685C127.884131 206.562435 151.307846 183.13507 180.090628 183.13507L180.090628 183.13507zM843.905692 842.888871 180.090628 842.888871c-28.782782 0-52.211363-23.399389-52.211363-52.187036L127.879265 486.704382l768.237789 0 0 303.996237C896.121919 819.489482 872.693338 842.888871 843.905692 842.888871L843.905692 842.888871zM343.370638 622.450762l-64.593408 0c-23.679141 0-43.064704 19.385563-43.064704 43.064704l0 21.532352c0 23.680357 19.385563 43.041595 43.064704 43.041595l64.593408 0c23.660896 0 43.040378-19.361237 43.040378-43.041595L386.411017 665.516683C386.411017 641.836325 367.031535 622.450762 343.370638 622.450762L343.370638 622.450762zM343.370638 622.450762"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-zhanghuzhongxinyinxingqia" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M909.634276 213.697033 114.198925 213.697033c-27.459399 0-49.720402 22.262026-49.720402 49.719378l0 49.725518 0 16.607236 33.167401 0 828.599681 0 33.108049 0 0-16.667611 0-49.665143C959.353654 235.95906 937.152003 213.697033 909.634276 213.697033L909.634276 213.697033zM97.645924 429.138804 64.478524 429.138804l0 16.61133 0 314.826292c0 27.463492 22.262026 49.725518 49.720402 49.725518l795.489586 0c27.463492 0 49.720402-22.205745 49.720402-49.725518l0-314.88155 0-16.557094L926.300864 429.137781 97.645924 429.137781 97.645924 429.138804zM163.92342 578.304102l198.885699 0 0 33.109072L163.92342 611.413174 163.92342 578.304102 163.92342 578.304102zM495.362065 710.857047l-331.438645 0 0-33.168424 331.438645 0L495.362065 710.857047 495.362065 710.857047z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-jiansheyinhang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M912.756895 540.616758H748.492714s-11.811 0-16.724917 1.998517c-2.915399 1.027399-12.797467 9.048073-12.797467 9.048073L516.414031 758.107187c-3.983731 3.025916-8.896624 3.025916-12.81077 0L288.235169 538.618241c-2.969635-2.998287-2.969635-8.993838 0-12.019755L504.603031 307.114656c2.914376-3.997034 8.827039-3.997034 11.811 0l189.801811 193.445804s7.842619 9.008164 16.725939 12.019755c8.827039 1.998517 21.63781-9.035794 21.63781-9.035794l87.538729-91.202165-255.717056-258.561847c-54.087872-55.108109-113.118314-50.098002-136.713708-47.093575C234.147296 141.754514 85.622588 321.140091 85.622588 534.620184c0 240.531192 195.714474 432.956759 424.87878 432.956759 225.193879 0 414.053224-184.402847 424.864454-416.925645 0-3.01159 0.957815-5.010107-4.940522-9.008164-5.870708-4.024663-17.668405-1.026376-17.668405-1.026376zM644.230092 146.764622L868.480482 373.257076l61.944818-61.125149s5.898337-10.027377 7.882527-19.035542c0.986467-5.010107-8.827039-13.039991-8.827039-13.039991L792.769127 139.755997C663.938969 8.462742 520.328177 71.614038 520.328177 71.614038s60.000536 0.992607 123.901915 75.150584z" fill="#0460A6" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-zhifubao" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M1023.65184 701.28128V197.49376c0-108.5952-88.13056-196.72576-196.79744-196.72576H197.07904C88.48384 0.768 0.35328 88.89856 0.35328 197.49376v629.77536C0.35328 935.86944 88.4224 1024 197.07904 1024h629.77536c96.76288 0 177.28512-69.96992 193.72544-162.00192-52.18816-22.5792-278.33856-120.23808-396.14464-176.45568-89.66656 108.5952-183.55712 173.76256-325.08928 173.76256s-235.99616-87.168-224.67584-193.84832c7.48544-70.03136 55.51616-184.50944 264.1408-164.87424 109.94176 10.29632 160.27136 30.82752 249.94304 60.43648 23.20896-42.53184 42.46528-89.344 57.10848-139.16672h-397.6192v-39.3984h196.73088V311.72096H205.00992v-43.36128h239.96416V166.28736s2.17088-15.98976 19.82464-15.98976h98.36544v118.06208h255.82592v43.36128h-255.82592v70.7328h208.68608c-19.17952 78.09024-48.2816 149.84704-84.74112 212.52096 60.63104 21.94432 336.54272 106.30656 336.54272 106.30656zM283.67872 791.77728c-149.5296 0-173.19424-94.39744-165.26336-133.8624 7.86432-39.26528 51.16416-90.496 134.30784-90.496 95.54944 0 181.12 24.42752 283.83744 74.43968-72.1408 93.95712-160.78848 149.91872-252.88192 149.91872z" fill="#009FE8" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-pufayinhang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M727.916 240.502C786.237 263.69 832.302 312.14 852.403 372.5c-14.658-3.404-29.68-4.787-45.378-4.787-27.96 0-54.554 5.146-79.11 15.002V240.502z m0 543.36c24.555 9.902 51.83 15.34 80.148 15.34C926.787 799.201 1024 702.33 1024 583.29V224.138L864.338 64.82v359.875h-0.681c0.323 5.089 0.68 10.214 0.68 15.344v0.681c0 91.09-56.596 168.848-136.427 200.92v142.223zM591.089 582.63v0.66c0 119.04-96.814 215.911-215.578 215.911-28.278 0-55.235-5.442-79.785-15.34v-142.57c79.509-31.73 136.105-109.83 136.105-200.577v-0.68c0.358-118.385 97.208-215.235 215.895-215.235 28.319 0 55.276 5.447 80.19 15.703v142.213c-79.832 31.723-136.428 109.491-136.428 199.915h-0.4z m136.827 58.998c-24.914 9.528-51.513 15.002-79.468 15.002-15.662 0-30.72-1.7-45.42-4.772 20.148 60.001 66.171 108.472 124.893 131.999V641.628h-0.005z m-432.19-258.913c24.55-9.534 51.512-15.002 79.785-15.002 15.38 0 30.362 1.383 45.061 4.787-20.106-60.364-66.17-108.81-124.851-132.341v142.556z m0 401.147c-58.68-23.189-104.704-72.003-125.174-131.999 14.659 3.072 29.681 4.772 45.343 4.772 27.996 0 54.917-5.468 79.831-15.34v142.567z m0-543.703c-24.914-9.913-51.835-15.36-79.831-15.36C96.855 224.799 0 321.649 0 440.714v359.189L159.657 959.18V599.327h0.323c-0.323-4.808-0.323-9.892-0.323-15.043v-0.998c0-90.747 56.238-168.494 136.07-200.576V240.159z" fill="#2D5082" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-zhongguoyinhang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M1020.943676 489.577653c-6.566272-181.308464-118.384891-304.877255-118.384892-304.877255C729.646956-18.48284 507.89128 0.473591 507.89128 0.473591c-236.820982-7.590252-382.456542 172.924628-382.456542 172.924628-99.633257 119.626467-110.884238 229.857918-110.884238 229.857918-44.184738 185.14839 47.909466 344.710078 47.909466 344.710078 68.593862 125.347956 140.950851 183.356425 258.388561 238.331352 117.476109 55.179724 296.058227 47.589472 406.942465-8.435035 110.858638-56.101306 178.518119-117.821702 240.545709-234.593826 61.963592-116.887321 52.606974-253.691053 52.606975-253.691053M459.956215 910.382248s-186.069972-10.418997-288.493575-190.933877c0 0-88.369477-127.293518-51.723791-285.908025C156.422934 274.938639 241.925266 211.362278 258.872136 195.221793c16.92127-16.114886 126.397535-82.008001 201.084079-80.804824v189.026714h-78.936061s-107.133911 6.65587-110.897037 126.320737v174.754992s2.828745 107.377106 113.712982 119.690466h76.107316v186.17237M396.021462 613.108044s-18.764434 4.735908-21.58038-17.074867V428.855637s2.803145-18.034848 16.895671-18.034848h232.097874s19.775614-3.865525 21.618778 18.034848v162.403233s4.723108 25.6507-14.092525 21.861974H396.021462m452.048785 122.468012C772.871713 851.452197 630.026498 904.686359 563.326999 910.382248V724.209878h88.318278s94.039766-18.96923 99.620457-117.783303V407.940845s-15.103705-99.671656-119.306473-104.497162H563.326999V114.468168s117.463309 9.459016 212.360659 97.841292c94.910149 88.305478 119.319273 176.623756 129.687071 224.136429 10.316599 47.499874 17.855652 183.266826-57.304482 299.142967z" fill="#972030" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-nongyeyinhang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M475.0208 316.2624h55.2448c8.4992 0 27.6224 2.1376 33.9968-8.4992 2.112-4.2496 4.2368-8.4992 4.2368-12.7488 2.1248-6.3744 0-21.248 0-27.6224V76.16c0-8.4992 2.1248-72.2432-2.1248-72.2432h-110.4768c-2.1248 0-2.1248 31.872-2.1248 36.1216V193.024c0 36.1216-4.2368 72.2432 0 106.24 2.1248 10.624 10.624 16.9984 21.248 16.9984z" fill="#349080" ></path>' +
    '' +
    '<path d="M636.4928 12.416v161.4848c0 48.8704 6.3744 101.9904-2.1248 150.8608-4.2496 31.872-76.48 10.624-99.8528 16.9984-21.248 6.3744-12.7488 48.8704-12.7488 65.8688v102.0032c8.4992-19.1232 36.1216-12.7488 53.1072-12.7488 27.6224 0 61.6064 6.3744 89.2416 0 10.624-2.1248 16.9984-12.7616 16.9984-23.3856-2.1248-2.1376 0-33.9968 0-40.3712V142.0288c142.3616 65.8688 235.8656 212.48 235.8656 369.7152 0 199.7184-152.9856 376.064-350.6048 401.5616V702.9632c0-4.2496-2.112-10.6112 0-14.8736 2.1248-8.4992-2.112-4.2368 6.3744-8.4992 12.7488-4.2496 123.2384 14.8736 108.3648-23.36-6.3744-8.4992 0-38.2592 0-51.008v-106.2144c2.1248 27.6096-33.9968 21.2352-50.9952 21.2352-27.6096 0-57.3568-4.2368-87.104 0-27.6224 0-21.248 36.1088-21.248 55.232v101.9904c-4.2496 0-12.7616 2.1248-17.0112 0-6.3488-2.1248-6.3488 0-6.3488-10.624V586.112c0-16.9984 2.0992-33.9968 0-48.8704-4.2496-25.4848-44.6336-17.0112-61.6192-17.0112-25.4976 0-57.3696 6.3744-85.0048 0-6.3744 0-10.624-8.4736-10.624-16.9728v118.9632c0 12.7488-2.1248 27.6224 0 42.5088 4.2496 23.36 36.1216 16.9984 53.12 16.9984h53.12c10.6112 0 8.4864 10.624 8.4864 21.2352v212.48C256.1664 887.808 103.1808 711.4624 103.1808 511.744c0-157.248 95.616-303.8464 237.9776-369.7152v333.5808c0 14.8864 8.4992 21.2608 21.248 23.3856h67.9936c19.136 0 59.4944-8.4992 70.1184 12.7488v-116.864c0-25.4976 6.3744-50.9952-25.4848-53.12-16.9984-2.1248-36.1216 0-53.1072 0-33.9968 0-33.9968-16.9984-33.9968-48.8704V14.5536C149.9264 71.9104-15.7952 299.264 1.2032 543.616 20.3264 834.7008 292.288 1055.68 581.248 1015.3088c261.3376-36.1216 456.832-274.0992 441.9584-537.5616C1010.4448 258.8928 851.0848 65.536 636.4928 12.416z" fill="#349080" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-zhaoshangyinhang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M469.572243 719.083292L608.451155 368.359964l144.779122 350.710529H469.572243v0.012799z m-290.684532 0l138.891711-350.710529L462.545745 719.083292H178.887711z m721.451055-80.030397h108.30277l-5.887411 20.017198h-92.995501l-9.419858-20.017198z m-21.220278-49.415859H1018.010199l-3.481252 21.169083h-125.965003l-9.445456-21.169083z m-21.130687-49.454254H1023.89761l-2.342166 21.19468H867.407659l-9.419858-21.19468z m-20.004399-49.415859H1023.89761v21.169083H846.212979l-8.229577-21.169083z m-21.20748-49.441456h202.424558l2.354964 21.181882H825.005499l-8.229577-21.181882zM795.568443 391.89681h214.212179l4.735526 21.181882h-209.515048l-9.432657-21.181882zM511.974403 0h21.143485l22.410559 2.354965 21.130687 1.177482 20.0044 3.519648 21.207479 3.532447 20.004399 4.709929 20.0044 5.887411 20.0044 5.874612 9.419858 3.532447 9.432656 3.532447 18.80132 8.229577 18.865314 8.255174 17.611039 9.40706 17.662233 9.419858 17.662234 10.584541 16.510349 11.774823 16.459154 11.774822 15.320068 11.749225 15.243276 12.965104 15.320068 14.129787 14.116988 14.116988 14.129787 14.129787 12.977902 15.307269 5.887412 8.229578 5.887411 8.255174 12.913908 16.471953 10.635737 16.471953 10.571743 16.484751 10.571743 17.649435 8.229577 18.839716 9.432656 17.649435 7.090491 18.839716 7.026498 19.991601 7.090491 18.839716H783.793621L648.459954 47.073693 507.226077 403.671633 358.914509 50.606139 97.667033 724.970703 216.554345 873.256674h604.905909l110.657734-161.225477-10.571743-24.727127h71.788022l-7.090491 18.839716-8.242376 17.623837-8.229577 17.662234-8.242376 16.49755-10.571743 17.662234-9.419858 16.484752-11.774822 15.281671-10.571743 15.281672-11.774823 15.320068-12.977902 15.281672-12.913908 12.952305-14.129787 14.116988-14.168184 12.977902-14.129787 12.913909-15.243275 11.774822-15.320068 11.774823-15.30727 10.571743-16.459154 10.622938-16.459154 9.39426-17.662234 9.394261-17.662233 8.242375-17.662234 7.090491-18.80132 7.064894-17.675032 7.052095-18.852515 5.887411-20.0044 4.684331-18.865313 4.748326-19.953205 3.506849-9.419858 1.177482-10.635736 1.164684-20.0044 2.380562-19.991601 1.164683h-47.035296l-25.891811-2.380562-25.943006-3.506849-25.891811-4.709929-24.688731-5.887411-23.549645-5.887412-23.549645-8.242375-23.549645-9.419858-22.346565-10.571743-22.346566-10.59734-10.635736-7.064894-10.571743-5.887411-21.207479-12.939506-20.0044-14.116989-20.004399-15.281671-9.368663-8.267974-8.280772-8.242375-9.368663-8.255175-8.229577-8.242376-17.662234-17.662233L116.468353 837.932207l-7.026497-9.432657-7.090491-10.59734-15.256075-19.978802-5.887411-9.432657-7.090491-10.59734-5.887411-10.597341-5.887411-11.774822-11.774823-21.143486-10.571743-23.549645-8.229577-22.372163-8.216778-24.701529-7.090491-23.536847-3.545245-12.913908-2.342166-11.774823-2.342166-12.965103-2.342166-12.926708-3.545245-24.739926-1.20308-27.069293L0 524.888311v-12.952305l1.139086-25.879012 1.20308-25.879012 3.545245-25.879012 4.684332-25.891811 5.887411-24.727127 7.090491-23.549645 8.229577-23.524048 8.229577-23.536846 10.571743-22.359364 11.774822-22.359364 5.887412-10.59734 5.887411-10.584542 12.977902-21.181882 15.256075-20.004399 14.116988-20.0044 8.293571-9.419858 8.229577-8.242376 8.229577-9.419858 9.432656-8.229577 17.598241-17.662233 17.662233-16.471953 10.635737-7.052095 9.355864-7.090491 20.0044-15.307269 10.635736-5.861814 10.571743-7.077692 10.571743-5.887412 10.635736-5.874612 22.346566-11.774823 22.346565-10.584541 23.549645-9.419858 23.549645-7.077692 23.549645-7.052095 12.913909-3.532447 11.774822-2.354964 12.977902-2.354965L434.260574 5.874613l25.943006-3.532447L486.09539 1.151885 499.009299 0h12.965104z" fill="#E50012" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-jiaotongyinhang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M808.5888 767.9872c-60.1216 1.9328-115.6864 3.8784-175.7824 5.8112-38.0672 161.8944-352.8448 118.1824-317.7728-87.2704 17.6256-121.7024 182.08-174.8608 284.1216-82.9568 22.4128 25.3312 33.408 48.8704 40.6016 100.4288 50.4192-1.9328 118.4256-3.8784 168.832-5.8112 2.5472-261.824-294.8352-394.7008-517.824-267.648C76.992 552.32 101.6704 923.392 325.6832 1018.1632V1024c-122.1504-2.4064-256.1408-97.024-285.312-209.4592l1.6512-603.6224C138.9824 144.9728 246.1568 65.9328 343.1296 0l11.648 5.824c-6.72 90.9952-2.4576 241.0368 2.9056 350.5408 60.7488-58.9568 101.6832-120.6144 206.5536-141.0944 67.584-13.1968 132.288-5.2352 173.0944 8.7296 306.368 104.96 325.44 500.8384 65.4592 637.0944-5.8368 0-18.4832 11.456-28.1344 13.3504 0-1.9328 6.08-10.3424 10.6624-19.1744l23.2704-87.2832z" fill="#1D2087" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-307584007998" viewBox="0 0 2986 1024">' +
    '' +
    '<path d="M1709.153908 134.356005h-13.468145v-13.386519l94.277011-94.113761c0-13.468144 0-13.468144 13.468145-13.468145h67.259097v13.468145l-80.727242 107.50028h-80.727241z m0 134.354944h-13.468145c0-13.468144 0-13.468144 13.468145-13.468144l80.727241-94.032136c0-13.468144 0-13.468144 13.468145-13.468145h67.259097v13.468145l-67.259097 80.645616h26.936288V416.289162c0 13.468144 0 13.468144-13.468144 13.468145H1763.10811V268.792574z m201.858916-53.709327a13.141644 13.141644 0 0 1-13.468144-13.468145v-40.241183a13.141644 13.141644 0 0 1 13.468144-13.468144H2220.20877l13.468145 13.468144v40.322808L2220.20877 215.001622h-53.872577v174.677752c0 26.854664-26.936289 40.322808-40.404434 40.322808h-147.578213c-13.468144 0-13.468144 0-13.468144-13.468145v-26.854663c0-13.468144 0-13.468144 13.468144-13.468145h107.663531V215.001622z m13.468144-134.354944a13.141644 13.141644 0 0 1-13.468144-13.468145V26.855725l13.468144-13.468145h282.667783v67.259098zM1318.904219 40.323869a13.141644 13.141644 0 0 1 13.468145 13.468145v40.322808a13.141644 13.141644 0 0 1-13.468145 13.468144h-107.66353l-13.468145 13.468145h-67.259097l40.404434-94.032136 13.468144-13.468144h67.259097v13.304894l-13.468144 13.468144zM1265.194892 241.856285h53.790952a13.141644 13.141644 0 0 1 13.468145 13.468145v40.322808H1265.194892v80.645616h40.404433a13.141644 13.141644 0 0 1 13.468144 13.468145V416.289162c0 13.468144 0 13.468144-13.468144 13.468145h-67.259097q-40.404433 0-40.404433-40.322809V295.647238h-67.422348v-40.322808l13.468145-13.468145h53.790952V201.615102h-53.790952a13.141644 13.141644 0 0 1-13.468145-13.87627v-26.446538a13.223269 13.223269 0 0 1 13.468145-13.468144h174.922627c13.468144 0 13.468144 0 13.468145 13.468144V187.738832c0 13.468144 0 13.468144-13.468145 13.468145H1265.194892v40.322808z m161.372858 134.436569h53.872577l13.304895 13.38652V416.289162a13.141644 13.141644 0 0 1-13.468145 13.468145h-80.727241q-40.404433 0-40.404434-40.322809V53.792014c0-13.468144 13.468144-40.322808 40.404434-40.322808h201.940541c26.936289 0 40.404433 26.854664 40.404433 40.322808V201.615102q0 40.322808-40.404433 40.322808h-174.922627V376.292854z m148.067963-309.114321h-148.067963v40.322808h148.067963V67.178533z m-148.067963 94.113761V187.738832h148.067963v-26.446538z m148.067963 107.50028h80.727242a13.141644 13.141644 0 0 0-13.468145 13.468145l-67.259097 67.177472 13.468145 13.468144v13.386519h53.872578l13.468144 13.468145V416.289162a13.141644 13.141644 0 0 1-13.468144 13.468145h-40.486059c-40.404433 0-53.872578-13.468144-67.259097-26.854664l-67.259097-134.354944H1534.557781l13.468144 40.322808 26.936289-40.322808zM565.259506 215.001622c-13.468144 0-13.468144 0-13.468144-13.468145V174.678813c0-13.468144 0-13.468144 13.468144-13.468144h80.727242v-40.241183a13.141644 13.141644 0 0 1 13.468144-13.468145h53.790953v53.790953h188.390772v-40.322808l13.468144-13.468145h53.872578a13.141644 13.141644 0 0 1 13.468144 13.468145v40.322808h80.727242v53.790953h-80.727242v26.854663c0 40.322808-13.468144 53.790953-80.727241 94.032136h-26.936289l13.468144 13.468145c26.936289 13.468144 53.872578 13.468144 80.727242 13.468144h80.727242a13.141644 13.141644 0 0 1 13.468144 13.468144v26.854664a13.141644 13.141644 0 0 1-13.468144 13.060019h-80.727242c-40.404433 0-67.259097 0-107.66353-26.854664l-53.872578-13.468144L767.281673 389.679374C713.245845 416.289162 699.859326 416.289162 659.454892 416.289162H578.727651c-13.468144 0-13.468144 0-13.468145-13.468144V376.292854c0-13.468144 0-13.468144 13.468145-13.468144h80.727241c26.936289 0 53.790953-13.468144 80.727242-13.468145v-13.386519h-26.936289c-53.790953-40.322808-67.259097-53.790953-67.259097-94.032136v-26.936288zM767.281673 13.469206A13.141644 13.141644 0 0 1 780.586567 0.001061h67.259097v26.854664h174.922628c26.936289 0 40.404433 26.854664 40.404433 53.790953v40.322808h-40.404433a13.141644 13.141644 0 0 1-13.468145-13.468145V80.646678H619.050459v26.854663a13.141644 13.141644 0 0 1-13.468145 13.468145h-40.322808l-13.468144-13.468145V80.646678a57.872209 57.872209 0 0 1 53.872578-53.790953H767.281673V13.469206z m-53.872578 228.55033c0 26.854664 0 26.854664 40.404433 40.322808l53.790953 26.854663 67.259097-26.854663c26.936289-13.468144 26.936289-13.468144 26.936289-40.322808v-27.017914h-188.554022v26.854663zM13.47371 349.438191A13.141644 13.141644 0 0 1 0.005565 335.970046v-40.322808a13.141644 13.141644 0 0 1 13.468145-13.468145h201.858916V80.646678H26.941854a13.141644 13.141644 0 0 1-13.468144-13.468145V26.855725A13.141644 13.141644 0 0 1 26.941854 13.469206h457.590411v67.177472H296.059868v201.532415H497.918784l13.468144 13.468145v40.322808L497.918784 349.438191H296.059868V416.289162a13.141644 13.141644 0 0 1-13.468145 13.468145H228.555895c-13.468144 0-13.468144 0-13.468144-13.468145v-66.850971z m174.922627-107.581906a13.141644 13.141644 0 0 1-13.468144 13.468145h-53.790953c-13.468144 0-13.468144-13.468144-26.936289-13.468145L40.409999 120.969486v-13.468145h67.259097c13.468144 0 13.468144 0 13.468144 13.468145l67.259097 120.968424z m215.327061-134.354944h53.872578c13.468144 0 13.468144 0 13.468144 13.468145h-13.468144l-53.872578 120.968424a13.141644 13.141644 0 0 1-13.468144 13.468145h-67.259098v-13.54977l53.872578-120.968424c13.468144-13.468144 13.468144-13.468144 26.936289-13.468145zM2005.289835 577.82527a13.468144 13.468144 0 0 1 26.936289 0v94.113761l94.113761-94.113761 13.468144-13.468144a13.141644 13.141644 0 0 1 13.468145 13.468144v13.468145l-67.259097 67.177472 67.259097 80.645616c13.468144 0 13.468144 0 13.468144 13.468145a47.016068 47.016068 0 0 1-26.936289 13.468144l-13.468144-13.468144-53.790953-80.645617-40.077933 40.322808v40.322809a13.468144 13.468144 0 0 1-26.936289 0V577.82527z m-228.55033 0a47.016068 47.016068 0 0 1 26.936289-13.468144c13.468144 0 13.468144 0 13.468144 13.468144l94.195386 120.968425V577.82527a47.016068 47.016068 0 0 1 26.936289-13.468144l13.468145 13.468144V752.584648l-13.468145 13.468144c-13.468144 0-13.468144 0-26.936289-13.468144l-94.521886-134.43657V752.584648l-13.468144 13.468144a47.016068 47.016068 0 0 1-26.936289-13.468144V577.82527zM1682.299244 685.652051l-40.404434-80.645616-26.936288 80.645616z m-134.59982 53.790953l80.727242-161.291233a13.141644 13.141644 0 0 1 13.468144-13.468145c13.468144 0 26.936289 0 26.936289 13.468145l67.259097 161.291233a13.141644 13.141644 0 0 1 13.468145 13.468144 47.016068 47.016068 0 0 1-26.936289 13.468144 13.141644 13.141644 0 0 1-13.468144-13.468144l-13.468145-40.322808H1601.490377l-13.468144 40.322808c-13.468144 13.468144-13.468144 13.468144-26.936289 13.468144l-13.468145-13.468144v-13.794645z m-94.195386 0c26.936289 0 40.404433-13.468144 40.404434-26.854664-0.16325-26.936289-13.54977-26.936289-40.404434-26.936289h-53.790952v53.790953zM1440.035894 644.839492c26.936289 0 40.404433 0 40.404433-26.854664 0-13.468144-13.468144-13.468144-40.404433-13.468144h-40.404433V644.839492z m-80.727241-53.709328a28.895292 28.895292 0 0 1 26.936288-26.854663h67.259097c13.468144 0 40.404433 13.468144 53.872578 26.854663a46.852818 46.852818 0 0 1 13.468145 26.854664q0 40.322808-40.404434 40.322808c26.936289 13.468144 40.404433 26.854664 40.404434 53.709328s-26.936289 53.790953-67.259097 53.790953h-67.259097a47.016068 47.016068 0 0 1-26.936289-13.468145V591.293415zM296.059868 564.438751h-40.322809v187.737771c0 13.468144 0 13.468144 13.468145 13.468144h26.936289V564.438751z m-134.59982 0H40.409999v201.614041h40.322808v-67.259097h80.727241C201.864482 698.793695 228.555895 685.652051 228.555895 644.839492v-13.223269c0-40.322808-26.936289-67.177472-67.259097-67.177472z m26.936289 94.032136a13.141644 13.141644 0 0 1-13.468144 13.468144H80.732807v-67.177472h107.66353v53.790953z m780.581002-94.032136h-53.872578l-94.195386 187.737771a13.141644 13.141644 0 0 0 13.468145 13.468144h26.936289v-13.060018l80.727241-147.823089 67.259097 147.823089a13.141644 13.141644 0 0 0 13.468145 13.468144h26.936289s13.468144-13.468144 0-13.468144l-80.727242-187.737771z m309.522447 0h-40.404433v134.354944C1224.382333 685.652051 1117.045303 577.82527 1117.045303 564.438751h-40.404434v201.614041h26.936289c13.468144 0 13.468144 0 13.468145-13.468144V618.148078c13.468144 13.468144 121.131675 134.354944 121.131675 134.354944v13.468145h40.404433V564.438751z m-565.253941 0h-80.727242c-26.936289 0-67.340722 26.854664-67.340722 53.790953v80.645616c0 40.322808 40.404433 67.177472 67.340722 67.177472h80.727242c26.936289 0 67.259097-26.854664 67.259097-67.177472v-40.404433H672.923037V685.652051H726.469114v39.996308H619.050459V604.761559H726.469114v26.854664h53.790953v-13.468145c0-26.854664-40.404433-53.790953-67.259097-53.790952z m-174.514502 0h-40.812559v134.354944C484.532265 685.652051 390.255254 577.82527 376.868734 564.438751h-40.404433v201.614041h40.404433V618.148078C390.255254 631.616223 497.918784 752.584648 497.918784 752.584648a13.141644 13.141644 0 0 0 13.468144 13.468144H538.731343v-201.614041z" fill="#E76D10" ></path>' +
    '' +
    '<path d="M968.977339 698.793695h-53.872578v67.177472h53.872578v-67.177472z" fill="#005438" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-gongshangyinhang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M800.167 548.621V775.77H548.723v-73.421h171.149v-83.827H548.723V391.578h171.149v-76.967H548.723v-73.446h251.444v226.969H629.018v76.941h171.149z m-576.512 0V775.77h251.417v-73.421H303.923v-83.827h171.149V391.578H303.923v-76.967h171.149v-73.446H223.655v226.969H394.803v76.941H223.655z" fill="#D62629" ></path>' +
    '' +
    '<path d="M512.013 0C229.235 0 0 229.222 0 512S229.235 1024 512.013 1024c282.765 0 512-229.222 512-512S794.778 0 512.013 0z m0 922.445c-226.688 0-410.445-183.757-410.445-410.445S285.325 101.542 512.013 101.542 922.458 285.312 922.458 512 738.701 922.445 512.013 922.445z" fill="#D62629" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-youzhengyinhang1" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M93.978 568.883l-4.941 28.045h148.416l6.579-28.045H93.978z m377.612 28.058l4.941-28.045H308.339l-6.605 28.045H471.59z m93.991-141.811L542.49 568.896l-6.58 28.045-23.091 113.779h-234.15l-4.941 26.368H547.43l36.301-168.192 23.091-113.766H934.95l-24.716 113.766H648.051l-59.392 281.971H248.973l-4.941 26.381H624.96l36.25-166.528 23.104-113.779H905.28L882.189 710.72H725.517l-34.599 166.528-24.755 113.792H154.995l59.367-280.307H0l24.73-113.779 4.94-28.045L54.4 455.142h212.723L326.49 174.81h234.137l29.696-141.812H1024l-24.73 113.78H629.901l-4.941 28.032-23.104 113.779H367.718l-6.604 26.381H636.48l4.941-26.381 24.755-113.779h328.128l-24.717 113.779H707.366l-29.644 140.173H338.035l-6.605 26.393h234.151v-0.025z" fill="#007E3E" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-gongshangyinhang-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M800.167 548.621V775.77H548.723v-73.421h171.149v-83.827H548.723V391.578h171.149v-76.967H548.723v-73.446h251.444v226.969H629.018v76.941h171.149z m-576.512 0V775.77h251.417v-73.421H303.923v-83.827h171.149V391.578H303.923v-76.967h171.149v-73.446H223.655v226.969H394.803v76.941H223.655z" fill="#d81e06" ></path>' +
    '' +
    '<path d="M512.013 0C229.235 0 0 229.222 0 512S229.235 1024 512.013 1024c282.765 0 512-229.222 512-512S794.778 0 512.013 0z m0 922.445c-226.688 0-410.445-183.757-410.445-410.445S285.325 101.542 512.013 101.542 922.458 285.312 922.458 512 738.701 922.445 512.013 922.445z" fill="#d81e06" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)