<template><div>
<Card>
    <Table :columns="columnsList" :data="tableData" border :loading="loading" size="large"></Table>
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
                    width: '100px',
                    align: 'center',
                },
                {
                    title: '名称',
                    key: 'spider',
                    align: 'center',
                    sortable: true,
                },
                {
                    title: '任务Id',
                    key: 'jobId',
                    align: 'center',
                    sortable: true,
                },
                {
                    title: '状态',
                    key: 'status',
                    width: '120px',
                    align: 'center',
                    sortable: true,
                },
                {
                    title: '状态时间',
                    key: 'timestamp',
                    width: '200px',
                    align: 'center',
                    sortable: true,
                },
            ],
            tableData: [],
            loading: true,
        };
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.getStatus();
        },
        getStatus () {
            this.loading = true;
            let _self = this;
            util.ajax.get("/scrapyd/status").then(res => {
                if (res.data.code === '0') {
                    _self.tableData = res.data.content;
                }
            }).then(() => {
                _self.loading = false;
            });
        },
    },
};
</script>
