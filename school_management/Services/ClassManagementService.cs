using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class ClassManagementService
    {
        private readonly ApplicationDbContext _context;

        public ClassManagementService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Teacher: dersin durumunu güncelle
        public async Task<bool> UpdateClassStatusAsync(int classScheduleId, string status)
        {
            var classManagements = await _context.ClassManagements
                .Where(cm => cm.ClassScheduleId == classScheduleId)
                .ToListAsync();

            if (!classManagements.Any()) return false;

            if (Enum.TryParse<StatusEnum>(status, true, out var newStatus))
            {
                foreach (var cm in classManagements)
                {
                    cm.Status = newStatus;
                }

                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}
