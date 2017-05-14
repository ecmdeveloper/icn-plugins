/**
 * 
 */
package com.ecmdeveloper.plugin.service.model;

import com.ecmdeveloper.plugin.util.CEIterable;
import com.filenet.api.collection.AccessPermissionDescriptionList;
import com.filenet.api.collection.AccessPermissionList;
import com.filenet.api.constants.PermissionSource;
import com.filenet.api.constants.PermissionType;
import com.filenet.api.constants.SecurityProxyType;
import com.filenet.api.core.Containable;
import com.filenet.api.core.CustomObject;
import com.filenet.api.core.Document;
import com.filenet.api.core.Folder;
import com.filenet.api.core.IndependentlyPersistableObject;
import com.filenet.api.meta.ClassDescription;
import com.filenet.api.meta.PropertyDescription;
import com.filenet.api.meta.PropertyDescriptionObject;
import com.filenet.api.security.AccessPermission;
import com.filenet.api.security.AccessPermissionDescription;
import com.ibm.ecm.json.JSONResponse;
import com.ibm.json.java.JSONArray;

/**
 * @author Ricardo Belfor
 *
 */
public class SecurityDataProvider {
	
    public JSONArray dumpSecurity(IndependentlyPersistableObject object) {
 		JSONArray objects = new JSONArray();
		addRoot(objects);
        dumpItem(object, 0, objects, "world");
        return objects;
    }

    private void dumpItem(IndependentlyPersistableObject object,  int level, JSONArray objects, String parentId) {
        
        if ( object == null ) {
            return;
        }
         
        String objectId;
        
        if (object instanceof Folder) {
           	objectId = addObject(objects, parentId, ((Folder) object).get_Name(), "folder");
        } else if (object instanceof CustomObject ) {
        	objectId = addObject(objects, parentId, ((CustomObject) object).get_Name(), "customobject");
        } else if (object instanceof Document ){
        	objectId = addObject(objects, parentId, ((Document) object).get_Name(), "document");
        } else {
        	objectId = parentId +"_" + "todo";
        }
         
        ClassDescription classDescription = ((IndependentlyPersistableObject)object).get_ClassDescription();
        
        if ( object instanceof Containable ) {
            addPermissions(object, level, objects, objectId, classDescription.get_PermissionDescriptions() );
        }
        
        if ( classDescription != null ) {
        	int propertyId = 0;
            for ( PropertyDescription description : new CEIterable<PropertyDescription>(classDescription.get_PropertyDescriptions()) ) {
                if (description instanceof PropertyDescriptionObject ) {
                    SecurityProxyType securityProxyType = ((PropertyDescriptionObject) description).get_SecurityProxyType();
                    if ( !securityProxyType.equals(SecurityProxyType.NONE) ) {
                    	
                		String id = addProperty(objects, objectId, description, propertyId);
                		
                		++propertyId;
                		
                        dumpItem( (IndependentlyPersistableObject) object.getProperties().getObjectValue(description.get_SymbolicName()), level+1, objects, id );
                    }
                }
            }
        }
    }

	private String addObject(JSONArray objects, String parentId, String name, String type) {
		
		JSONResponse data = new JSONResponse();
		data.put("type", type );
		data.put("name", name );
		String id = parentId + "_object_" + Integer.toHexString(name.hashCode() );
		data.put("id", id );
		data.put("parent", parentId);
		objects.add(data);
		
		return id;
	}

	private String addProperty(JSONArray objects, String parentId, PropertyDescription description, int propertyId) {
		JSONResponse data = new JSONResponse();
		data.put("type", "property" );
		data.put("name", description.get_SymbolicName() );
		String id = parentId + "_property_" + propertyId;
		data.put("id", id);
		data.put("parent", parentId);
		objects.add(data);
		
		return id;
	}

	private void addPermissions(IndependentlyPersistableObject object, int level, JSONArray objects, String parentId, AccessPermissionDescriptionList descriptions) {
		int childId = 0;
		
		AccessPermissionList permissions = ((Containable) object).get_Permissions();

		for ( AccessPermission permission : new CEIterable<AccessPermission>( permissions ) ) {
		    if ( permission.get_PermissionSource().equals(PermissionSource.SOURCE_DIRECT) ||  permission.get_PermissionSource().equals(PermissionSource.SOURCE_DEFAULT)) {
		        if ( permission.get_InheritableDepth() < 0 || (level == 0 && permission.get_InheritableDepth() == 0) ) {
		            addPermission(objects, parentId, childId, permission, descriptions);
		    		++childId;
		        }
		    }
		}
	}

	private void addPermission(JSONArray objects, String parentId, int childId, AccessPermission permission, AccessPermissionDescriptionList descriptions) {
		JSONResponse data = new JSONResponse();
		data.put("type", "permission" );
		data.put("name", permission.get_GranteeName() );
		data.put("id", parentId + "_permission_" + childId);
		data.put("parent", parentId);
		data.put("accessType", permission.get_AccessType().toString() );
		data.put("granteeType", permission.get_GranteeType().toString() );
//		data.put("permissionSource", permission.get_PermissionSource() );
	
		getPermissionDescription(data, permission.get_AccessMask(), descriptions);

		objects.add(data);
	}

	private void addRoot(JSONArray objects) {
		JSONResponse data = new JSONResponse();
		data.put("type", "permission" );
		data.put("name", "Root" );
		data.put("id", "world");
		objects.add(data);
	}
	
	private void getPermissionDescription(JSONResponse data, Integer accessMask, AccessPermissionDescriptionList descriptions) {

		JSONArray accessRights = new JSONArray();

		data.put("level", "Custom Level");
		data.put("accessRights", accessRights);
		
		for ( AccessPermissionDescription description : new CEIterable<AccessPermissionDescription>(descriptions )) {
			
			PermissionType permissionType = description.get_PermissionType();
					
			if (permissionType.equals(PermissionType.LEVEL) || permissionType.equals(PermissionType.LEVEL_DEFAULT)) {
				if ( accessMask.equals(description.get_AccessMask() ) ) {
					data.put("level", description.get_DisplayName() );
				}
			} else {

				JSONResponse accessRight = new JSONResponse();
				accessRight.put("name", description.get_DisplayName() );
				accessRight.put("value", ( description.get_AccessMask() & accessMask) != 0 );
				accessRights.add(accessRight);
			}
		}
	}	
}
