import os

base_dir = "dataset/Training"

classes = os.listdir(base_dir)

print("Classes found:")
for cls in classes:
    cls_path = os.path.join(base_dir, cls)
    if os.path.isdir(cls_path):
        print(f"{cls}: {len(os.listdir(cls_path))} images")

