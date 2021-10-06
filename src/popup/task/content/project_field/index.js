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
    modelIdProp: 'plan_id',
    async addModel(name) {
      const project = await createProject(
        { workspace: parent.workspace },
        {
          name,
          // color_id: 22,
        }
      );

      // parent.segments.project = project;
      // parent.segments.updateCollection();
      // parent.segments.segmentFilters();

      this.saveTask(project);
    },
    async saveTask(project) {
      let plan_id = null,
        timeline_segment_id = null;
      if (project) {
        parent.colorField.colorId = project.color_id;
        plan_id = project.id;
        const segment = project && project.segments.first();
        timeline_segment_id = segment && segment.id;
      }

      parent.task.set({
        color_id: null,
        plan_id,
        timeline_segment_id,
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
