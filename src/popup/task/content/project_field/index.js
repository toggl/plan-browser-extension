import SelectField from '../select_field';
import css from './style.module.scss';
import IconView from './icon';
import { createProject } from 'src/popup/utils/helpers';

export default function(props) {
  const { parent } = props;
  const field = new SelectField({
    ...props,
    tabIndex: 3,
    heading: 'Project',
    headingIconClass: css.icon,
    iconView: IconView,
    getCollectionItems: () =>
      parent.workspace.projects.models.filter(m => !m.archived),
    addButtonlabel: 'Add Project',
    modelIdProp: 'project_id',
    async addModel(name) {
      const project = await createProject({
        name,
        // color_id: 22,
      });

      parent.segments.project = project;
      parent.segments.updateCollection();
      parent.segments.segmentFilters();

      this.saveTask(project);
    },
    async saveTask(project) {
      let project_id = null,
        project_segment_id = null;
      if (project) {
        const segment = project && project.segments.models[0];
        parent.colorField.colorId = project.color_id;
        project_id = project.id;
        project_segment_id = segment && segment.id;
      }
      await parent.task.set({
        color_id: null,
        project_id,
        project_segment_id,
      });
    },
    parent,
  });

  // field.listenToAndRun(
  //   props.task,
  //   'change:workspace_members',
  //   () => (field.canRemove = !!props.task.workspace_members.length)
  // );

  return field;
}
