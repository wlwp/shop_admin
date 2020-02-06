<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row style="margin: 10px 0;" :gutter="20">
      <el-col :span="8" style="padding: 0;">
        <el-input placeholder="请输入搜索内容" v-model="searchText" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="goodsList" style="width: 100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价值" width="180"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time | dateFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="10"
      :current-page="currentPage"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      goodsList: [],
      total: 0,
      currentPage: 1,
      searchText: ''
    }
  },
  created () {
    // console.log(this.$route.params.page)

    let page = this.$route.params.page
    this.loadGoodsList(page)
  },
  filters: {
    dateFilter (res) {
      return moment(res).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  watch: {
    $route (to, from) {
      let page = to.params.page
      this.loadGoodsList(page)
    }
  },
  methods: {
    // 自定义排序
    indexMethod (index) {
      return index
    },
    // 加载数据列表
    async loadGoodsList (pagenum = 1, pagesize = 10, query = '') {
      let res = await this.$axios.get('goods', {
        params: {
          query,
          pagenum,
          pagesize
        }
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
        this.currentPage = +res.data.data.pagenum
      }
    },
    // 切换页码
    changePage (page) {
      console.log(page)
      this.$router.push('/goods/' + page)
      this.currentPage = page
      this.loadGoodsList(this.currentPage, 10, this.searchText)
    },
    // 搜索商品
    searchGoods () {
      this.loadGoodsList(1, 10, this.searchText)
    },
    // 添加商品
    addGoods () {
      this.$router.push('add_goods')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
