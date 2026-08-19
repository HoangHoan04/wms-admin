import { Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

export function useActionConfirm() {
  const { t } = useI18n();

  function confirmDelete(options: {
    title?: string;
    content?: string;
    onOk: () => void | Promise<any>;
  }) {
    Modal.confirm({
      title: options.title || t('common.deleteConfirmTitle', 'Xác nhận xóa'),
      content: options.content || t('common.deleteConfirmContent', 'Bạn có chắc chắn muốn xóa bản ghi này không? Hành động này không thể hoàn tác.'),
      okText: t('common.confirm', 'Xác nhận'),
      okType: 'danger',
      cancelText: t('common.cancel', 'Hủy bỏ'),
      onOk: options.onOk,
    });
  }

  function confirmAction(options: {
    title: string;
    content: string;
    okType?: 'primary' | 'danger';
    onOk: () => void | Promise<any>;
  }) {
    Modal.confirm({
      title: options.title,
      content: options.content,
      okText: t('common.confirm', 'Xác nhận'),
      okType: options.okType || 'primary',
      cancelText: t('common.cancel', 'Hủy bỏ'),
      onOk: options.onOk,
    });
  }

  return {
    confirmDelete,
    confirmAction,
  };
}
