<template>
	<div class="mod-config">
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
			<el-form-item>
				<el-form-item label="学校" prop="type">
					<el-input v-model="dataForm.schoolName" placeholder="学校" clearable></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="type">
					<el-input v-model="dataForm.professional" placeholder="专业" clearable></el-input>
				</el-form-item>
			</el-form-item>
			<el-form-item label="年份" prop="year">
				<el-select v-model="dataForm.year" placeholder="请选择">
					<el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
				<el-button v-if="isAuth('edu:historyscoreline:save')" type="primary" @click="addOrUpdateHandle()">新增
				</el-button>
				<el-button v-if="isAuth('edu:historyscoreline:delete')" type="danger" @click="deleteHandle()"
					:disabled="dataListSelections.length <= 0">批量删除</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
			style="width: 100%;">
			<el-table-column prop="schoolName" header-align="center" align="center" label="学校名称"></el-table-column>
			<el-table-column prop="schoolCode" header-align="center" align="center" label="学校代号"> </el-table-column>
			<el-table-column prop="professionalName" header-align="center" align="center" label="专业名称"></el-table-column>
			<el-table-column prop="professionalCode" header-align="center" align="center" label="专业代号"></el-table-column>
			<el-table-column prop="recruitmentQuantity" header-align="center" align="center" label="招收数量"></el-table-column>
			<el-table-column prop="scoreLine" header-align="center" align="center" label="分数线"> </el-table-column>
			<el-table-column prop="ranking" header-align="center" align="center" label="排名"> </el-table-column>
			<el-table-column prop="year" header-align="center" align="center" label="年份"> </el-table-column>
			<el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
			:page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
			layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
	import AddOrUpdate from './add-or-update'
	export default {
		data() {
			return {
				dataForm: {
					schoolName: '',
					professional: '',
					year: ''
				},
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				addOrUpdateVisible: false,

				//历史分数线年份
				years: []
			}
		},
		components: {
			AddOrUpdate
		},
		activated() {
			this.getDataList()
			this.initYears()
		},
		methods: {
			// 获取数据列表
			getDataList() {
				this.dataListLoading = true
				this.$http({
					url: this.$http.adornUrl('/edu/historyscoreline/list'),
					method: 'get',
					params: this.$http.adornParams({
						'page': this.pageIndex,
						'limit': this.pageSize,
						'schoolName': this.dataForm.schoolName,
						'professional': this.dataForm.professional,
						'year': this.dataForm.year
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 0) {
						this.dataList = data.page.list
						this.totalPage = data.page.totalCount
					} else {
						this.dataList = []
						this.totalPage = 0
					}
					this.dataListLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			},
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
			},
			// 新增 / 修改
			addOrUpdateHandle(id) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init(id)
				})
			},
			// 删除
			deleteHandle(id) {
				var ids = id ? [id] : this.dataListSelections.map(item => {
					return item.id
				})
				this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: this.$http.adornUrl('/edu/historyscoreline/delete'),
						method: 'post',
						data: this.$http.adornData(ids, false)
					}).then(({
						data
					}) => {
						if (data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.getDataList()
								}
							})
						} else {
							this.$message.error(data.msg)
						}
					})
				})
			},
			//初始化历史分数线年份
			initYears() {
				var that = this;
				this.$generalApi.queryDictionaryByPCode('HISTORY_SCORE_LINE_YEAR', function(data) {
					that.years = [];
					data.forEach((elment, index, array) => {
						that.years.push({
							value: elment.value,
							label: elment.name
						});
					});
				});
			}
		}
	}
</script>
