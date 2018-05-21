<template><div>
<Card>
    <Collapse accordion @on-change="changePanel">
        <Panel v-for="item in plusyData" :name="item.spider" :key="item.spider">
            <span style="margin-left: 5px; font-size: 16px;">
                <Icon style="color: red; margin-left: 5px; margin-right:5px;" type="information-circled"></Icon>
                {{item.name}}
                <a :href="item.href" target="_blank" @click.stop>
                    <Icon style="margin-left:10px;" color="blue" type="ios-home"></Icon>
                    <span style="font-size: 14px; margin-left: 2px;">网站</span>
                </a>
            </span>
            <p slot="content">
                <Table :columns="columnsList" :data="tableData" border :loading="loading" size="large"></Table>
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
                        return h('Tooltip', {
                            props: {
                                content: params.row.isRead === 0 ? '未读' : '已读',
                                placement: 'top',
                            }
                        }, [
                            h('Icon', {
                                props: {
                                    type: params.row.isRead === 0 ? 'flag' : 'checkmark',
                                    class: "ivu-icon",
                                },
                                style: {
                                    fontSize: '24px',
                                    color: params.row.isRead === 0 ? 'red' : 'auto',
                                }
                            }),
                        ]);
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
            util.ajax.get("/spider/list").then(res => {
                if (res.data.code === '0') {
                    _self.plusyData = res.data.content;
                }
            });
        },
        getItems (spiderName) {
            this.tableData = [];
            this.loading = true;
            let _self = this;
            util.ajax.get("/spider/datas?spider=" + spiderName).then(res => {
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
            util.ajax.post("/spider/read?spider=" + this.spider + "&rowId=" + rowId);
        }
    },
};
</script>
