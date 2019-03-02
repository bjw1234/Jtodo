import Vue from 'vue';
import CompNotification from './notification-func';

// 继承notification组件，返回vue构造函数
const NotificationConstructor = Vue.extend(CompNotification);

const instances = []; // 组件数组
let seed = 1; // 组件id

const deleteInstance = (ins) => {
  if (!ins) return;
  // 数组中删除
  let index = instances.findIndex(item => item.id === ins.id);
  instances.splice(index, 1);
  ins.$destroy(); // 销毁当前对象
  // DOM中删除
  document.body.removeChild(ins.$el);
  // 调整位置
  if (!instances.length) return;
  for (let i = index; i < instances.length; i++) {
    let item = instances[i];
    item.verticalOffset -= (item.$el.offsetHeight + 16);
  }
};

const notify = (options) => {
  if (Vue.prototype.$isServer) return;
  const { autoCloseTime, ...rest } = options;
  const instance = new NotificationConstructor({
    propsData: {
      ...rest
    },
    data: {
      autoCloseTime
    }
  });

  // 点击关闭按钮
  instance.$on('close', () => {
    instance.visible = false;
  });
  instance.$on('closed', (ins) => {
    deleteInstance(ins);
  });

  instance.visible = true;
  instance.id = `notification_${seed++}`;
  instance.$mount(); // 生成$el
  document.body.appendChild(instance.$el);

  let verticalOffset = 0;
  instances.forEach((item) => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  verticalOffset += 16; // 距离屏幕底部的距离
  instance.verticalOffset = verticalOffset;
  instances.push(instance);
};

export default notify;
