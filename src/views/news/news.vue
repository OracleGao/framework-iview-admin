<template><div>
<Card>
    <Collapse accordion @on-change="changePanel">
        <Panel v-for="item in plusyData" :name="item.spider" :key="item.spider">
            <span style="width: 100%">{{item.name}}<Icon style="color: red; margin-left: 10px;" type="information-circled"></Icon></span>
            <p slot="content">
                <Table :columns="columnsList" :data="tableData" border :loading="loading"></Table>
            </p>
        </Panel>
    </Collapse>
</Card>
</div></template>
<script>
import util from '@/libs/util';
export default {
    data () {
        return {
            columnsList:[
                {
                    title: '序号',
                    type: 'index',
                    width: '160px',
                    align: 'center',
                },
                {
                    title: '发布时间',
                    key: 'timestamp',
                    width: '160px',
                    align: 'center',
                    sortable: true,
                },
                {
                    title: '新闻标题',
                    key: 'text',
                    align: 'center',
                    render: (h, params) => {
                        return h('a', {
                            attrs: {
                                href: params.row.href,
                                target: '_blank',
                            },
                            on: {
                                click: () => {
                                    this.setRead(params.row.rowId);
                                }
                            }
                        }, params.row.text);
                    },
                },
                {
                    title: '阅读状态',
                    key: 'isRead',
                    width: '160px',
                    align: 'center',
                    sortable: true,
                    render: (h, params) => {
                        return h('Icon', {
                            props: {
                                type: params.row.isRead === 0 ? 'flag' : 'checkmark',
                                class: "ivu-icon",
                            },
                            style: {
                                fontSize: '24px',
                                color: params.row.isRead === 0 ? 'red' : 'auto',
                            }
                        });
                    },
                },
            ],
            tableData: [],
            plusyData: [],
            loading: true,
            spider: '',
        };
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            let _self = this;
            util.ajax.get("/plusy/list").then(res => {
                if (res.data.code === '0') {
                    _self.plusyData = res.data.content;
                }
            });
        },
        getItems (spiderName) {
            this.tableData = [];
            this.loading = true;
            let _self = this;
            util.ajax.get("/plusy/datas?spider=" + spiderName).then(res => {
                if (res.data.code === '0') {
                    _self.tableData = res.data.content;
                }
            }).then(() => {
                _self.loading = false;
            });
        },
        changePanel (panels) {
            if (panels.length === 1) {
                this.spider = panels[0];
                this.getItems(panels[0]);
            }
        },
        setRead (rowId) {
            this.tableData.filter(data => data.rowId == rowId)[0].isRead = 1;
            util.ajax.post("/plusy/read?spider=" + this.spider + "&rowId=" + rowId);
        }
    },
};
</script>
