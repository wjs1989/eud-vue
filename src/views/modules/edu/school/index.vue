<template>
	<div class="mod-config">
		<el-form :inline="true" :model="search" @keyup.enter.native="getDataList()">
			<!-- <el-form-item label="编号" prop="schoolCode"> 
        <el-input v-model="search.schoolCode" placeholder="编号" clearable></el-input> 
      </el-form-item> -->
			<el-form-item label="名称" prop="schoolName"><el-input v-model="search.schoolName" placeholder="名称:模糊匹配" clearable></el-input></el-form-item>
			<el-form-item label="区域" prop="districtChange">
				<el-cascader placeholder="试试搜索：浙江" :options="districtOptions" filterable @change="districtChange" v-model="districtDefault"></el-cascader>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model="search.type" placeholder="请选择">
					<el-option v-for="item in schoolTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="seach()">查询</el-button>
				<el-button v-if="isAuth('edu:school:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
				<el-button v-if="isAuth('edu:school:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>			
				<el-button type="primary" @click="uploadHandle()">上传文件</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<!-- <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="">
      </el-table-column> -->
			<el-table-column prop="schoolName" header-align="center" align="center" label="学校名称"></el-table-column>
			<el-table-column prop="schoolCode" header-align="center" align="center" label="学校代号"></el-table-column>
			<el-table-column prop="province" header-align="center" align="center" label="地区">
				<template slot-scope="scope">
					<span>{{ getDistrict({ province: scope.row.province, city: scope.row.city }) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="type" header-align="center" align="center" label="类型">
				<template slot-scope="scope">
					<span>{{ getSchoolType(scope.row.type) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="level" header-align="center" align="center" label="等级">
				<template slot-scope="scope">
					<span>{{ getSchoolLevel(scope.row.level) }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
			:current-page="search.pageIndex"
			:page-sizes="[10, 20, 50, 100]"
			:page-size="search.pageSize"
			:total="totalPage"
			layout="total, sizes, prev, pager, next, jumper"
		></el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> 
		<!-- 弹窗, 上传文件 -->
		<upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
	</div>
</template>

<script>
import AddOrUpdate from './add-or-update';
import Upload from './excel-upload'
export default {
	data() {
		return {
			search: {
				schoolName: '',
				schoolCode: '',
				province: '',
				city: '',
				type: '',

				pageIndex: 1,
				pageSize: 10
			},
			dataList: [],
			totalPage: 0,
			dataListLoading: false,
			dataListSelections: [],
			addOrUpdateVisible: false,
            uploadVisible: false,

			//学校类型
			schoolTypes: [{ value: '1', label: '' }],
			//学校等级
			schoolLevels: [{ value: '1', label: '' }],

			//区域
			districtOptions: [],
			districtDefault: []
		};
	},
	components: {
		AddOrUpdate,
		Upload
	},
	activated() {
		this.initSchoolType();
		this.initSchoolLevel();
		this.initDistrictOptions();
		this.getDataList();
	},
	methods: {
		seach(){
			this.search.pageIndex = 1
			this.getDataList()
		},
		// 获取数据列表
		getDataList() {
			this.dataListLoading = true;
			this.$http({
				url: this.$http.adornUrl('/edu/school/list'),
				method: 'get',
				params: this.$http.adornParams({
					page: this.search.pageIndex,
					limit: this.search.pageSize,
					schoolName: this.search.schoolName,
					schoolCode: this.search.schoolCode,
					province: this.search.province,
					city: this.search.city,
					type: this.search.type					
				})
			}).then(({ data }) => {
				if (data && data.code === 0) {
					this.dataList = data.page.list;
					this.totalPage = data.page.totalCount;
				} else {
					this.dataList = [];
					this.totalPage = 0;
				}
				this.dataListLoading = false;
			});
		},
		// 每页数
		sizeChangeHandle(val) {
			this.search.pageSize = val;
			this.search.pageIndex = 1;
			this.getDataList();
		},
		// 当前页
		currentChangeHandle(val) {
			this.search.pageIndex = val;
			this.getDataList();
		},
		// 多选
		selectionChangeHandle(val) {
			this.dataListSelections = val;
		},
		// 新增 / 修改
		addOrUpdateHandle(id) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(id, this.schoolTypes, this.schoolLevels, this.districtOptions);
			});
		},
		//初始化学校类型
		initSchoolType() {
			var that = this;
			this.$generalApi.queryDictionaryByPCode('SCHOOL_TYPE', function(data) {
				that.schoolTypes = [];
				data.forEach((elment, index, array) => {
					that.schoolTypes.push({
						value: elment.code,
						label: elment.name
					});
				});
			});
		},
		//初始化学校等级
		initSchoolLevel() {
			var that = this;
			this.$generalApi.queryDictionaryByPCode('SCHOOL_LEVEL', function(data) {
				that.schoolLevels = [];
				data.forEach((elment, index, array) => {
					that.schoolLevels.push({
						value: elment.code,
						label: elment.name
					});
				});
			});
		},
		//初始化区域信息
		initDistrictOptions() {
			var that = this;
			this.$http({
				url: this.$http.adornUrl(`/district/tree`),
				method: 'get'
			}).then(({ data }) => {
				if (data && data.code === 0) {
					//区域信息
					that.districtOptions = [];
					that.districtOptions = data.district.children;
				} else {
					this.$message.error(data.msg);
				}
			});
		},
		//获取学校类型
		getSchoolType(type) {
			for (var i = 0; i < this.schoolTypes.length; i++) {
				if (this.schoolTypes[i].value == type) {
					return this.schoolTypes[i].label;
				}
			}

			return type;
		},
		//获取学校等级
		getSchoolLevel(level) {
			for (var i = 0; i < this.schoolLevels.length; i++) {
				if (this.schoolLevels[i].value == level) {
					return this.schoolLevels[i].label;
				}
			}

			return level;
		},
		//获取区域
		getDistrict(district) {
			var d = '';
			for (var i = 0; i < this.districtOptions.length; i++) {
				if (this.districtOptions[i].value == district.province) {
					d = this.districtOptions[i].label;

					var children = this.districtOptions[i].children;
					if (children != undefined && children.length > 0) {
						for (var j = 0; j < children.length; j++) {
							if (children[j].value == district.city) {
								d = d + ' / ' + children[j].label;
							}
						}
					}
				}
			}
			return d;
		},
		//区域选择事件
		districtChange(e) {
			this.search.province = e[0]; //区域选择省
			if (e.length > 1) {
				this.search.city = e[1]; //区域选择市区
			}
		},
		// 删除
		deleteHandle(id) {
			var ids = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$http({
					url: this.$http.adornUrl('/edu/school/delete'),
					method: 'post',
					data: this.$http.adornData(ids, false)
				}).then(({ data }) => {
					if (data && data.code === 0) {
						this.$message({
							message: '操作成功',
							type: 'success',
							duration: 1500,
							onClose: () => {
								this.getDataList();
							}
						});
					} else {
						this.$message.error(data.msg);
					}
				});
			});
		}, 
		// 上传文件
		uploadHandle () {
		  this.uploadVisible = true
		  this.$nextTick(() => {
		    this.$refs.upload.init()
		  })
		}
	}
};
</script>
